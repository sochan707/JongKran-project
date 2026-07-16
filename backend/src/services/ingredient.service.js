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

export const bulkAddIngredientsToRecipeService = async (recipeId, ingredients, adminId) => {
  if (!Array.isArray(ingredients) || ingredients.length === 0) {
    const error = new Error(
      "Ingredients must be a non-empty array! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  const normalizedIngredients = ingredients.map((item, index) => {
    const ingredientId = Number(item.ingredient_id);
    const quantity = Number(item.quantity);
    const unit =
      typeof item.unit === "string" ? item.unit.trim() : "";

    if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
      const error = new Error(
        `Ingredient ID at position ${index + 1} is invalid! ʕ•̀ᆺ•́ʔ`
      );
      error.statusCode = 400;
      throw error;
    }

    if (!Number.isFinite(quantity) || quantity <= 0) {
      const error = new Error(
        `Quantity at position ${index + 1} must be greater than 0! ʕ•̀ᆺ•́ʔ`
      );
      error.statusCode = 400;
      throw error;
    }

    if (!unit) {
      const error = new Error(
        `Unit at position ${index + 1} is required! ʕ•̀ᆺ•́ʔ`
      );
      error.statusCode = 400;
      throw error;
    }

    if (unit.length > 15) {
      const error = new Error(
        `Unit at position ${index + 1} must not exceed 15 characters! ʕ•̀ᆺ•́ʔ`
      );
      error.statusCode = 400;
      throw error;
    }

    return {
      recipe_id: recipeId,
      ingredient_id: ingredientId,
      quantity,
      unit,
    };
  });

  const ingredientIds = normalizedIngredients.map(
    (item) => item.ingredient_id
  );

  const uniqueIngredientIds = new Set(ingredientIds);

  if (uniqueIngredientIds.size !== ingredientIds.length) {
    const error = new Error(
      "The request contains duplicate ingredients! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        recipe_id: recipeId,
        deleted_at: null,
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

    const existingIngredients = await tx.ingredient.findMany({
      where: {
        ingredient_id: {
          in: ingredientIds,
        },
      },
      select: {
        ingredient_id: true,
      },
    });

    if (existingIngredients.length !== ingredientIds.length) {
      const existingIds = new Set(
        existingIngredients.map((item) => item.ingredient_id)
      );

      const missingIds = ingredientIds.filter(
        (id) => !existingIds.has(id)
      );

      const error = new Error(
        `Ingredient not found: ${missingIds.join(", ")}`
      );
      error.statusCode = 404;
      throw error;
    }

    const alreadyAttached =
      await tx.recipeIngredient.findMany({
        where: {
          recipe_id: recipeId,
          ingredient_id: {
            in: ingredientIds,
          },
        },
        select: {
          ingredient_id: true,
        },
      });

    if (alreadyAttached.length > 0) {
      const duplicateIds = alreadyAttached.map(
        (item) => item.ingredient_id
      );

      const error = new Error(
        `Ingredients already exist in this recipe: ${duplicateIds.join(", ")}`
      );
      error.statusCode = 409;
      throw error;
    }

    await tx.recipeIngredient.createMany({
      data: normalizedIngredients,
    });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: recipeId,
        action_type: "update",
      },
    });

    const addedIngredients =
      await tx.recipeIngredient.findMany({
        where: {
          recipe_id: recipeId,
          ingredient_id: {
            in: ingredientIds,
          },
        },
        include: {
          ingredient: {
            select: {
              ingredient_id: true,
              name: true,
            },
          },
        },
      });

    return addedIngredients;
  });
};

export const updateRecipeIngredientService = async (recipeId, ingredientId, data, adminId) => {
  const normalizedRecipeId = Number(recipeId);
  const normalizedIngredientId = Number(ingredientId);

  const hasQuantity = Object.prototype.hasOwnProperty.call(data, "quantity");

  const hasUnit = Object.prototype.hasOwnProperty.call(data, "unit");

  if (!hasQuantity && !hasUnit) {
    const error = new Error(
      "Quantity or unit is required! ʕ•̀ᆺ•́ʔ"
    );
    error.statusCode = 400;
    throw error;
  }

  const updateData = {};

  if (hasQuantity) {
    const quantity = Number(data.quantity);

    if (!Number.isFinite(quantity) || quantity <= 0) {
      const error = new Error(
        "Quantity must be greater than 0! ʕ•̀ᆺ•́ʔ"
      );
      error.statusCode = 400;
      throw error;
    }

    updateData.quantity = quantity;
  }

  if (hasUnit) {
    const unit =
      typeof data.unit === "string" ? data.unit.trim() : "";

    if (!unit) {
      const error = new Error(
        "Unit cannot be blank! ʕ•̀ᆺ•́ʔ"
      );
      error.statusCode = 400;
      throw error;
    }

    if (unit.length > 15) {
      const error = new Error(
        "Unit must not exceed 15 characters! ʕ•̀ᆺ•́ʔ"
      );
      error.statusCode = 400;
      throw error;
    }

    updateData.unit = unit;
  }

  return prisma.$transaction(async (tx) => {
    const recipe = await tx.recipe.findFirst({
      where: {
        recipe_id: normalizedRecipeId,
        deleted_at: null,
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

    const recipeIngredient =
      await tx.recipeIngredient.findUnique({
        where: {
          recipe_id_ingredient_id: {
            recipe_id: normalizedRecipeId,
            ingredient_id: normalizedIngredientId,
          },
        },
        select: {
          recipe_id: true,
          ingredient_id: true,
        },
      });

    if (!recipeIngredient) {
      const error = new Error(
        "Ingredient does not belong to this recipe! ˏ(•́∧•̀)ˎ"
      );
      error.statusCode = 404;
      throw error;
    }

    const updatedRecipeIngredient =
      await tx.recipeIngredient.update({
        where: {
          recipe_id_ingredient_id: {
            recipe_id: normalizedRecipeId,
            ingredient_id: normalizedIngredientId,
          },
        },
        data: updateData,
        include: {
          ingredient: {
            select: {
              ingredient_id: true,
              name: true,
            },
          },
        },
      });

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: normalizedRecipeId,
        action_type: "update",
      },
    });

    return updatedRecipeIngredient;
  });
};