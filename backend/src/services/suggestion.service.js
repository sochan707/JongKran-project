import prisma from "../prismaClient.js";

export const createSuggestionService = async ({userId, recipeId, suggestionText}) => {
  const recipe = await prisma.recipe.findUnique({
    where: {
      recipe_id: recipeId,
    },
    select: {
      recipe_id: true,
    },
  });

  if (!recipe) {
    const error = new Error("Recipe not found! ˏ(•́∧•̀)ˎ");
    error.statusCode = 404;
    throw error;
  }

  const suggestion = await prisma.suggestion.create({
    data: {
      user_id: userId,
      recipe_id: recipeId,
      suggestion_text: suggestionText.trim(),
    },
    include: {
      user: {
        select: {
          user_id: true,
          user_name: true,
          user_profile: true,
        },
      },
      recipe: {
        select: {
          recipe_id: true,
          title: true,
          image_url: true,
        },
      },
    },
  });

  return suggestion;
};

export const getAllSuggestionsService = async () => {
  const suggestions = await prisma.suggestion.findMany({
    where: {
      deleted_at: null,
    },
    orderBy: {
      created_at: "desc",
    },
    include: {
      user: {
        select: {
          user_id: true,
          user_name: true,
          user_profile: true,
        },
      },
      recipe: {
        select: {
          recipe_id: true,
          title: true,
          image_url: true,
        },
      },
    },
  });

  return suggestions;
};

export const getSuggestionByIdService = async (suggestionId) => {
  const suggestion = await prisma.suggestion.findFirst({
    where: {
      suggestion_id: suggestionId,
      deleted_at: null,
    },
    include: {
      user: {
        select: {
          user_id: true,
          user_name: true,
          user_profile: true,
        },
      },
      recipe: {
        select: {
          recipe_id: true,
          title: true,
          image_url: true,
        },
      },
    },
  });

  if (!suggestion) {
    const error = new Error("Suggestion not found! ˏ(•́∧•̀)ˎ");
    error.statusCode = 404;
    throw error;
  }

  return suggestion;
};

export const deleteSuggestionService = async (suggestionId) => {
  const suggestion = await prisma.suggestion.findFirst({
    where: {
      suggestion_id: suggestionId,
      deleted_at: null,
    },
  });

  if (!suggestion) {
    const error = new Error("Suggestion not found! ˏ(•́∧•̀)ˎ");
    error.statusCode = 404;
    throw error;
  }

  const deletedSuggestion = await prisma.suggestion.update({
    where: {
      suggestion_id: suggestionId,
    },
    data: {
      deleted_at: new Date(),
    },
  });

  return deletedSuggestion;
};

export const updateSuggestionStatusService = async (suggestionId, status) => {
  const suggestion = await prisma.suggestion.findFirst({
    where: {
      suggestion_id: suggestionId,
      deleted_at: null,
    },
  });

  if (!suggestion) {
    const error = new Error("Suggestion not found! (; •́ᆺ•̀)");
    error.statusCode = 404;
    throw error;
  }

  const updatedSuggestion = await prisma.suggestion.update({
    where: {
      suggestion_id: suggestionId,
    },
    data: {
      status,
    },
    include: {
      user: {
        select: {
          user_id: true,
          user_name: true,
          user_profile: true,
        },
      },
      recipe: {
        select: {
          recipe_id: true,
          title: true,
          image_url: true,
        },
      },
    },
  });

  return updatedSuggestion;
};