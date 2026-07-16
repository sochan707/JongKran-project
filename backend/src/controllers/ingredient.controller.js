import { addIngredientToRecipeService, bulkAddIngredientsToRecipeService, updateRecipeIngredientService, removeRecipeIngredientService } from "../services/ingredient.service.js";

export const addIngredientToRecipeController = async (req, res) => {
    try {
        const {id} = req.params;
        const recipeIngredient = await addIngredientToRecipeService(id, req.body);

        return res.status(201).json({
            success: true,
            message: "Ingredient added to recipe successfully",
            data: recipeIngredient,
        });

    } catch(err){
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
};

export const bulkAddIngredientsToRecipeController = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const adminId = req.user.userId;
    const { ingredients } = req.body;

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    const addedIngredients =
      await bulkAddIngredientsToRecipeService(
        recipeId,
        ingredients,
        adminId
      );

    return res.status(201).json({
      success: true,
      message: "Ingredients added successfully! ᕕ( ᐛ )ᕗ",
      count: addedIngredients.length,
      data: addedIngredients,
    });
  } catch (error) {
    console.error("BULK ADD INGREDIENTS ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to add ingredients! o(╥﹏╥)o",
    });
  }
};

export const updateRecipeIngredientController = async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const ingredientId = Number(req.params.ingredientId);
    const adminId = req.user.userId;

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Ingredient ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    const updateData = {};

    if (
      Object.prototype.hasOwnProperty.call(req.body, "quantity")
    ) {
      updateData.quantity = req.body.quantity;
    }

    if (
      Object.prototype.hasOwnProperty.call(req.body, "unit")
    ) {
      updateData.unit = req.body.unit;
    }

    const updatedIngredient =
      await updateRecipeIngredientService(
        recipeId,
        ingredientId,
        updateData,
        adminId
      );

    return res.status(200).json({
      success: true,
      message:
        "Recipe ingredient updated successfully! ᕕ( ᐛ )ᕗ",
      data: updatedIngredient,
    });
  } catch (error) {
    console.error("UPDATE RECIPE INGREDIENT ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update recipe ingredient! o(╥﹏╥)o",
    });
  }
};

export const removeRecipeIngredientController = async (req, res) => {
  try {
    const recipeId = Number(req.params.recipeId);
    const ingredientId = Number(req.params.ingredientId);
    const adminId = req.user.userId;

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    if (!Number.isInteger(ingredientId) || ingredientId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Ingredient ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    const removedIngredient =
      await removeRecipeIngredientService(
        recipeId,
        ingredientId,
        adminId
      );

    return res.status(200).json({
      success: true,
      message:
        "Ingredient removed from recipe successfully! ᕕ( ᐛ )ᕗ",
      data: removedIngredient,
    });
  } catch (error) {
    console.error("REMOVE RECIPE INGREDIENT ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to remove recipe ingredient! o(╥﹏╥)o",
    });
  }
};