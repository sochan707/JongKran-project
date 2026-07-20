import prisma from "../prismaClient.js";

const normalizeIngredient = (ingredient) =>
  String(ingredient || "")
    .trim()
    .toLowerCase();

const UNIT_TO_GRAMS = {
  g: 1,
  gram: 1,
  grams: 1,
  kg: 1000,
  kilogram: 1000,
  kilograms: 1000,
  ml: 1,
  milliliter: 1,
  milliliters: 1,
};

// Count-based units need an ingredient-specific edible-weight estimate. Keeping
// these conversions explicit prevents an unknown "piece" from silently being
// treated as 1 gram.
const INGREDIENT_GRAMS_PER_UNIT = {
  egg: 50,
  lime: 67,
  "red chili": 5,
  "kaffir lime leaf": 0.5,
};

const DEFAULT_GRAMS_PER_ITEM = 100;

const getIngredientWeightInGrams = ({ ingredient, quantity, unit }) => {
  const amount = Number(quantity);
  if (!Number.isFinite(amount) || amount <= 0) return null;

  const normalizedUnit = String(unit || "").trim().toLowerCase();
  if (UNIT_TO_GRAMS[normalizedUnit]) {
    return {
      grams: amount * UNIT_TO_GRAMS[normalizedUnit],
      usedDefaultWeight: false,
    };
  }

  // Some AI-provided units contain preparation notes, such as
  // "g, cooked". Preserve the explicit metric measurement.
  if (normalizedUnit.startsWith("g,")) {
    return { grams: amount, usedDefaultWeight: false };
  }

  if (normalizedUnit.startsWith("ml,")) {
    return { grams: amount, usedDefaultWeight: false };
  }

  const normalizedName = normalizeIngredient(ingredient?.name);
  const gramsPerUnit = INGREDIENT_GRAMS_PER_UNIT[normalizedName];
  if (gramsPerUnit) {
    return {
      grams: amount * gramsPerUnit,
      usedDefaultWeight: false,
    };
  }

  // The admin recipe form currently stores name-only ingredients as one
  // "item". Use an explicit, surfaced estimate so the nutrition panel can
  // still provide useful numbers until exact quantities are supplied.
  return {
    grams: amount * DEFAULT_GRAMS_PER_ITEM,
    usedDefaultWeight: true,
  };
};

export const calculateRecipeNutrition = (recipe) => {
  const totals = { calories: 0, fat: 0, carbs: 0, protein: 0 };
  let calculatedIngredientCount = 0;
  let usedDefaultWeights = false;

  for (const row of recipe.recipeIngredients || []) {
    const weight = getIngredientWeightInGrams(row);
    const nutrientValues = {
      calories: row.ingredient?.calories_per_100g,
      fat: row.ingredient?.fat_per_100g,
      carbs: row.ingredient?.carbs_per_100g,
      protein: row.ingredient?.protein_per_100g,
    };

    if (weight === null || Object.values(nutrientValues).every((value) => value == null)) {
      continue;
    }

    const multiplier = weight.grams / 100;
    for (const [nutrient, value] of Object.entries(nutrientValues)) {
      const numericValue = Number(value);
      if (Number.isFinite(numericValue)) totals[nutrient] += numericValue * multiplier;
    }
    usedDefaultWeights ||= weight.usedDefaultWeight;
    calculatedIngredientCount += 1;
  }

  if (calculatedIngredientCount === 0) return null;

  const servings = Number(recipe.servings) > 0 ? Number(recipe.servings) : 1;
  const round = (value) => Math.round(value * 10) / 10;

  return {
    perServing: Object.fromEntries(
      Object.entries(totals).map(([key, value]) => [key, round(value / servings)]),
    ),
    total: Object.fromEntries(
      Object.entries(totals).map(([key, value]) => [key, round(value)]),
    ),
    calculatedIngredientCount,
    ingredientCount: recipe.recipeIngredients?.length || 0,
    estimated: true,
    usedDefaultWeights,
  };
};

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
      const ingredient = await tx.ingredient.upsert({ where: { name }, update: {}, create: { name } });
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

export const getDeletedRecipeCountService = async () => {
  return prisma.recipe.count({
    where: {
      deleted_at: {
        not: null,
      },
    },
  });
};

export const getAllRecipesForAdminService = async () => {
  return prisma.recipe.findMany({
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
      updated_at: true,
      deleted_at: true,
    },
    orderBy: { created_at: "desc" },
  });
};

export const getRecipesByIdService = async (recipeId, includeCookingDetails = false, includeDeleted = false) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: Number(recipeId),
      ...(includeDeleted ? {} : { deleted_at: null }),
    },
    include: {
      recipeIngredients: {
        include: {
          ingredient: {
            select: {
              name: true,
              calories_per_100g: true,
              carbs_per_100g: true,
              fat_per_100g: true,
              protein_per_100g: true,
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

  const ingredientsMissingNutrition = recipe.recipeIngredients
    .filter(({ ingredient }) =>
      [
        ingredient?.calories_per_100g,
        ingredient?.carbs_per_100g,
        ingredient?.fat_per_100g,
        ingredient?.protein_per_100g,
      ].every((value) => value == null)
    )
    .map(({ ingredient }) => normalizeIngredient(ingredient?.name))
    .filter(Boolean);

  if (ingredientsMissingNutrition.length > 0) {
    const nutritionProfiles = await prisma.ingredient.findMany({
      where: {
        AND: [
          {
            OR: [...new Set(ingredientsMissingNutrition)].map((name) => ({
              name: { equals: name, mode: "insensitive" },
            })),
          },
          {
            OR: [
              { calories_per_100g: { not: null } },
              { carbs_per_100g: { not: null } },
              { fat_per_100g: { not: null } },
              { protein_per_100g: { not: null } },
            ],
          },
        ],
      },
      select: {
        name: true,
        calories_per_100g: true,
        carbs_per_100g: true,
        fat_per_100g: true,
        protein_per_100g: true,
      },
    });

    const nutritionByName = new Map(
      nutritionProfiles.map((profile) => [
        normalizeIngredient(profile.name),
        profile,
      ])
    );

    recipe.recipeIngredients = recipe.recipeIngredients.map((row) => {
      const profile = nutritionByName.get(
        normalizeIngredient(row.ingredient?.name)
      );

      return profile
        ? { ...row, ingredient: { ...row.ingredient, ...profile } }
        : row;
    });
  }

  const response = {
    ...recipe,
    nutrition: calculateRecipeNutrition(recipe),
    cookingDetailsAvailable: includeCookingDetails,
  };

  // Recipe descriptions stay public, but the content needed to cook is only
  // returned after optionalAuthenticate has identified a signed-in user.
  if (!includeCookingDetails) {
    delete response.recipeIngredients;
    delete response.steps;
  }

  return response;
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

export const restoreRecipeService = async (recipeId, adminId) => {
  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: recipeId,
      deleted_at: { not: null },
    },
  });

  if (!recipe) {
    const error = new Error("Deleted recipe not found");
    error.statusCode = 404;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const restored = await tx.recipe.update({
      where: { recipe_id: recipeId },
      data: { deleted_at: null },
    });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: recipeId,
        action_type: "approve",
      },
    });

    return restored;
  });
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
        const ingredient = await tx.ingredient.upsert({ where: { name }, update: {}, create: { name } });
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
