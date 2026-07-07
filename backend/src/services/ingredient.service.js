import prisma from "../prismaClient.js";

export const addIngredientToRecipeService = async (recipeId, data) => {
  const {ingredient_id, quantity, unit} = data;

  if (!ingredient_id || !quantity || !unit) {
    throw new Error(
      "Ingredient, quantity, and unit are required"
    );
  }

  const recipeIngredient = await prisma.recipeIngredient.create({
    data: {
      recipe_id: Number(recipeId),
      ingredient_id: Number(ingredient_id),
      quantity,
      unit,
    },
    include: {
      ingredient: {
        select: {
          name: true,
        },
      },
    },
  });

  return recipeIngredient;
};