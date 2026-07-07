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
  const {title, description, image_url, difficulty, prep_time, cook_time, servings} = data;

  if (!title || !difficulty || prep_time == null || cook_time == null || !servings){
    throw new Error("Title, difficulty, prep_time, cook_time, and servings are required! ʕ•̀ᆺ•́ʔ");
  }

  const recipe = await prisma.recipe.create({
    data: {
      title,
      description,
      image_url,
      difficulty,
      prep_time,
      cook_time,
      servings,
      created_by: userId,
    },
  });

  return recipe;
}

export const getAllRecipesService = async () => {
  const recipes = await prisma.recipe.findMany({
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

export const getRecipesByIdService = async (recipeId, isLoggedIn) => {
  const recipe = await prisma.recipe.findUnique({
    where: {
      recipe_id: Number(recipeId),
    },
    include: isLoggedIn ? {
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
    }
    : {},
  });

  if (!recipe){
    throw new Error("Recipe not found! ˏ(•́∧•̀)ˎ")
  }

  if(!isLoggedIn) {
    return {
      recipe_id: recipe.recipe_id,
      title: recipe.title,
      description: recipe.description,
      image_url: recipe.image_url,
      difficulty: recipe.difficulty,
      prep_time: recipe.prep_time,
      cook_time: recipe.cook_time,
      servings: recipe.servings,
      view_count: recipe.view_count,
      message: "Login to view ingredients and instructions",
    };
  }

  return recipe;
};