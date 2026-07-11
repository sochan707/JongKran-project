import { createSuggestionService } from "../services/suggestion.service.js";

export const createSuggestionController = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { recipe_id, suggestion_text } = req.body;

    if (!recipe_id) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID is required! (ó﹏ò｡)",
      });
    }

    if (
      !suggestion_text || typeof suggestion_text !== "string" || !suggestion_text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Suggestion text is required! (ó﹏ò｡)",
      });
    }

    const recipeId = Number(recipe_id);

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! (ó﹏ò｡)",
      });
    }

    const suggestion = await createSuggestionService({userId, recipeId, suggestionText: suggestion_text});

    return res.status(201).json({
      success: true,
      message: "Suggestion submitted successfully! ᕕ( ᐛ )ᕗ",
      data: suggestion,
    });
  } catch (error) {
    console.error("CREATE SUGGESTION ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to submit suggestion! (~T༚T~)",
    });
  }
};