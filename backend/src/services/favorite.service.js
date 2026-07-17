import prisma from "../prismaClient.js";

export const toggleFavoriteService = async (userId, recipeId) => {
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

  const existingFavorite = await prisma.favorite.findUnique({
    where: {
      user_id_recipe_id: {
        user_id: userId,
        recipe_id: normalizedRecipeId,
      },
    },
  });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        favorite_id: existingFavorite.favorite_id,
      },
    });

    return {
      action: "removed",
      message: "Recipe removed from favorites! ᕕ( ᐛ )ᕗ",
    };
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

  const favorite = await prisma.favorite.create({
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
        },
      },
    },
  });

  return {
    action: "added",
    message: "Recipe added to favorites! ʕ•̀ᆺ•́ʔ",
    data: favorite,
  };
};

export const getUserFavoritesService = async (userId) => {
  const favorites = await prisma.favorite.findMany({
    where: {
      user_id: userId,
      recipe: {
        deleted_at: null,
      },
    },
    include: {
      recipe: {
        select: {
          recipe_id: true,
          title: true,
          image_url: true,
          difficulty: true,
          prep_time: true,
          cook_time: true,
          servings: true,
        },
      },
    },
    orderBy: {
      favorite_id: "desc",
    },
  });

  return favorites;
};