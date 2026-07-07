import { addIngredientToRecipeService } from "../services/ingredient.service.js";

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