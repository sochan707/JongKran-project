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
    const [history, aiHistory] = await Promise.all([
      prisma.history.findMany({
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
      }),
      prisma.userAICooking.findMany({
        where: {
          user_id: userId,
          action: "cook",
        },
        include: {
          aiRecipe: true,
        },
        orderBy: {
          created_at: "desc",
        },
      }),
    ]);

    return [
      ...history.map((item) => ({ ...item, historyType: "recipe" })),
      ...aiHistory.map((item) => ({ ...item, historyType: "ai" })),
    ].sort(
      (left, right) =>
        new Date(right.cooked_at || right.created_at) -
        new Date(left.cooked_at || left.created_at)
    );
};
