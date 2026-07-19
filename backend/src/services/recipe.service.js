import prisma from "../prismaClient.js";

const normalizeIngredient = (ingredient) =>
  String(ingredient || "")
    .trim()
    .toLowerCase();

const formatRecipe = (recipe, requestedIngredients) => {
  const requestedSet = new Set(requestedIngredients);
  const ingredients = recipe.recipeIngredients.map((item) => ({
    id: item.ingredient.ingredient_id,
    name: item.ingredient.name,
    quantity: Number(item.quantity),
    unit: item.unit,
  }));

  const matchedIngredients = ingredients
    .filter((item) => requestedSet.has(normalizeIngredient(item.name)))
    .map((item) => item.name);

  return {
    id: recipe.recipe_id,
    title: recipe.title,
    description: recipe.description,
    imageUrl: recipe.image_url,
    difficulty: recipe.difficulty,
    cookTime: recipe.cook_time,
    createdBy: recipe.created_by,
    ingredients,
    matchedIngredients,
    matchCount: matchedIngredients.length,
    steps: recipe.steps.map((step) => ({
      stepNumber: step.step_number,
      instruction: step.instruction_text,
    })),
  };
};

export const findRecipesByIngredients = async (ingredients) => {
  const normalizedIngredients = [
    ...new Set(ingredients.map(normalizeIngredient).filter(Boolean)),
  ];

  if (normalizedIngredients.length === 0) {
    return [];
  }

  const recipes = await prisma.recipe.findMany({
    where: {
      deleted_at: null,

      recipeIngredients: {
        some: {
          ingredient: {
            OR: normalizedIngredients.map((name) => ({
              name: { equals: name, mode: "insensitive" },
            })),
          },
        },
      },
    },
    include: {
      recipeIngredients: {
        include: {
          ingredient: true,
        },
      },
      steps: {
        orderBy: {
          step_number: "asc",
        },
      },
    },
  });

  return recipes
    .map((recipe) => formatRecipe(recipe, normalizedIngredients))
    .sort((left, right) => right.matchCount - left.matchCount);
};

export const createRecipeService = async (data, userId) => {
  const {title, description, image_url, difficulty, prep_time, cook_time, servings, ingredients = [], steps = []} = data;

  if (!title || !difficulty || prep_time == null || cook_time == null || !servings){
    throw new Error("Title, difficulty, prep_time, cook_time, and servings are required! ʕ•̀ᆺ•́ʔ");
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length > 30) {
    const error = new Error(
      "Title must not exceed 30 characters! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  const recipe = await prisma.$transaction(async (tx) => {
    const created = await tx.recipe.create({ data: {
      title: trimmedTitle,
      description,
      image_url,
      difficulty,
      prep_time,
      cook_time,
      servings,
      created_by: userId,
    }});

    for (const rawName of ingredients) {
      const name = String(rawName).trim().toLowerCase();
      if (!name) continue;
      if (name.length > 20) throw new Error(`Ingredient '${name}' must not exceed 20 characters`);
      const ingredient = await tx.ingredient.upsert({ where: { name }, update: {}, data: { name } });
      await tx.recipeIngredient.create({ data: { recipe_id: created.recipe_id, ingredient_id: ingredient.ingredient_id, quantity: 1, unit: "item" } });
    }

    if (steps.length) await tx.recipeStep.createMany({ data: steps.map((instruction, index) => ({ recipe_id: created.recipe_id, step_number: index + 1, instruction_text: String(instruction).trim() })) });
    await tx.logs_audit.create({ data: { user_id: userId, recipe_id: created.recipe_id, action_type: "create" } });
    return created;
  });

  return recipe;
}

export const getAllRecipesService = async () => {
  const recipes = await prisma.recipe.findMany({
    where: {
      deleted_at: null,
    },
    select: {
      recipe_id: true,
      title: true,
      description: true,
      image_url: true,
      difficulty: true,
      prep_time: true,
      cook_time: true,
      servings: true,
      view_count: true,
      created_at: true,
    },
    orderBy: {
      created_at: "desc",
    },
  });

  return recipes;
}

export const getRecipesByIdService = async (recipeId) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: Number(recipeId),
      deleted_at: null,
    },
    include: {
      recipeIngredients: {
        include: {
          ingredient: {
            select: {
              name: true,
            },
          },
        },
      },
      steps: {
        orderBy: {
          step_number: "asc",
        },
      },
    },
  });

  if (!recipe){
    throw new Error("Recipe not found! ˏ(•́∧•̀)ˎ")
  }

  return recipe;
};

export const deleteRecipeService = async (recipeId, adminId) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: recipeId,
      deleted_at: null,
    },
  });

  if (!recipe) {
    const error = new Error("Recipe not found! ˏ(•́∧•̀)ˎ");
    error.statusCode = 404;
    throw error;
  }

  const deletedRecipe = await prisma.$transaction(async (tx) => {
    const deleted = await tx.recipe.update({
      where: {
        recipe_id: recipeId,
      },
      data: {
        deleted_at: new Date(),
      },
    });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: recipeId,
        action_type: "delete",
      },
    });

    return deleted;
  });

  return deletedRecipe;
};

export const updateRecipeService = async (recipeId, updateData, adminId) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: recipeId,
      deleted_at: null,
    },
  });

  if (!recipe) {
    const error = new Error("Recipe not found! ˏ(•́∧•̀)ˎ");
    error.statusCode = 404;
    throw error;
  }

  const updatedRecipe = await prisma.$transaction(async (tx) => {
    const { ingredients, steps, ...recipeFields } = updateData;
    const updated = await tx.recipe.update({
      where: {
        recipe_id: recipeId,
      },
      data: recipeFields,
    });

    if (ingredients !== undefined) {
      await tx.recipeIngredient.deleteMany({ where: { recipe_id: recipeId } });
      for (const rawName of ingredients) {
        const name = String(rawName).trim().toLowerCase();
        if (!name) continue;
        if (name.length > 20) throw new Error(`Ingredient '${name}' must not exceed 20 characters`);
        const ingredient = await tx.ingredient.upsert({ where: { name }, update: {}, data: { name } });
        await tx.recipeIngredient.create({ data: { recipe_id: recipeId, ingredient_id: ingredient.ingredient_id, quantity: 1, unit: "item" } });
      }
    }

    if (steps !== undefined) {
      await tx.recipeStep.deleteMany({ where: { recipe_id: recipeId } });
      if (steps.length) await tx.recipeStep.createMany({ data: steps.map((instruction, index) => ({ recipe_id: recipeId, step_number: index + 1, instruction_text: String(instruction).trim() })) });
    }

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: recipeId,
        action_type: "update",
      },
    });

    return updated;
  });

  return updatedRecipe;
};
