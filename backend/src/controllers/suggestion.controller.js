import { createSuggestionService, getAllSuggestionsService, getSuggestionByIdService, deleteSuggestionService } from "../services/suggestion.service.js";

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

export const getAllSuggestionsController = async (req, res) => {
  try {
    const suggestions = await getAllSuggestionsService();

    return res.status(200).json({
      success: true,
      count: suggestions.length,
      data: suggestions,
    });
  } catch (error) {
    console.error("GET ALL SUGGESTIONS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get suggestions! o(╥﹏╥)o",
    });
  }
};

export const getSuggestionByIdController = async (req, res) => {
  try {
    const suggestionId = Number(req.params.id);

    if (!Number.isInteger(suggestionId) || suggestionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Suggestion ID must be a valid number! (; •́ᆺ•̀)",
      });
    }

    const suggestion = await getSuggestionByIdService(suggestionId);

    return res.status(200).json({
      success: true,
      data: suggestion,
    });
  } catch (error) {
    console.error("GET SUGGESTION BY ID ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to get suggestion! (; •́ᆺ•̀)",
    });
  }
};

export const deleteSuggestionController = async (req, res) => {
  try {
    const suggestionId = Number(req.params.id);

    if (!Number.isInteger(suggestionId) || suggestionId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Suggestion ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    const deletedSuggestion = await deleteSuggestionService(suggestionId);

    return res.status(200).json({
      success: true,
      message: "Suggestion deleted successfully! ＼( ᵔ ω ᵔ )／",
      data: deletedSuggestion,
    });
  } catch (error) {
    console.error("DELETE SUGGESTION ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to delete suggestion! o(╥﹏╥)o",
    });
  }
};