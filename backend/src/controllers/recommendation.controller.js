import { generateRecipeFromIngredients } from "../services/openaiRecipe.service.js";
import { findRecipesByIngredients } from "../services/recipe.service.js";

const parseIngredients = (value) => {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === "string") {
    return value.split(",");
  }

  return [];
};

export const recommendRecipes = async (req, res) => {
  try {
    const ingredients = [
      ...new Set(
        parseIngredients(req.body.ingredients)
          .map((ingredient) => String(ingredient).trim())
          .filter(Boolean)
      ),
    ];

    if (ingredients.length === 0) {
      return res.status(400).json({
        message: "Please provide ingredients as an array or comma-separated string.",
      });
    }

    const recipes = await findRecipesByIngredients(ingredients);

    if (recipes.length > 0) {
      return res.json({
        source: "database",
        recipes,
      });
    }

    const generatedRecipe = await generateRecipeFromIngredients(ingredients);

    return res.json({
      source: "openai",
      recipes: [generatedRecipe],
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      message: error.message || "Failed to recommend recipes",
    });
  }
};
