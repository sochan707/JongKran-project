import { addIngredientToRecipeService, bulkAddIngredientsToRecipeService } from "../services/ingredient.service.js";

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