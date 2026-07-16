import prisma from "../prismaClient.js";

export const addHistoryService = async (userId, recipeId) => {
  const normalizedRecipeId = Number(recipeId);

  if (
    !Number.isInteger(normalizedRecipeId) ||
    normalizedRecipeId <= 0
  ) {
    const error = new Error(
      "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  const recipe = await prisma.recipe.findFirst({
    where: {
      recipe_id: normalizedRecipeId,
      deleted_at: null,
    },
    select: {
      recipe_id: true,
    },
  });

  if (!recipe) {
    const error = new Error(
      "Recipe not found! ˏ(•́∧•̀)ˎ"
    );
    error.statusCode = 404;
    throw error;
  }

  const history = await prisma.history.create({
    data: {
      user_id: userId,
      recipe_id: normalizedRecipeId,
    },
    include: {
      recipe: {
        select: {
          recipe_id: true,
          title: true,
          image_url: true,
          difficulty: true,
          cook_time: true,
          servings: true,
        },
      },
    },
  });

  return history;
};

export const getUserHistoryService = async (userId) => {
    const history = await prisma.history.findMany({
        where: {
            user_id: userId
        },
        include: {
            recipe: {
                select: {
                    recipe_id: true,
                    title: true,
                    image_url: true,
                    difficulty: true,
                    cook_time: true,
                    servings: true
                }
            }
        },
        orderBy: {
            cooked_at: "desc"
        }
    });

    return history;
};