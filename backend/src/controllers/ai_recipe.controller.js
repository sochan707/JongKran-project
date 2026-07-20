import { getAIRecipesService, reviewAIRecipeService } from "../services/ai_recipe.service.js";
import prisma from "../prismaClient.js";

export const getPendingAIRecipesController = async (_req, res) => {
  const recipes = await prisma.aIGeneratedRecipe.findMany({
    orderBy: { created_at: "desc" },
  });
  return res.json({ success: true, data: recipes });
};

export const getPendingAIRecipeByIdController = async (req, res) => {
  const aiRecipeId = Number(req.params.id);

  if (!Number.isInteger(aiRecipeId) || aiRecipeId <= 0) {
    return res.status(400).json({
      success: false,
      message: "AI recipe ID must be a valid number",
    });
  }

  const recipe = await prisma.aIGeneratedRecipe.findFirst({
    where: {
      ai_recipe_id: aiRecipeId,
    },
  });

  if (!recipe) {
    return res.status(404).json({
      success: false,
      message: "AI recipe not found",
    });
  }

  return res.json({ success: true, data: recipe });
};

export const getAIRecipeStatsController = async (_req, res) => {
  try {
    const [pendingCount, publishedCount] = await prisma.$transaction([
      prisma.aIGeneratedRecipe.count({
        where: { status: "pending" },
      }),
      prisma.aIGeneratedRecipe.count({
        where: {
          status: "approved",
          approved_recipe_id: { not: null },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: { pendingCount, publishedCount },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to get AI recipe statistics",
    });
  }
};

export const reviewAIRecipeController = async (req, res) => {
  try {
    const recipe = await reviewAIRecipeService(
      Number(req.params.id),
      req.body.status,
      req.user.userId,
    );

    return res.json({
      success: true,
      message: req.body.status === "approved"
        ? "AI recipe approved and added to recipes"
        : "AI recipe rejected",
      data: recipe,
    });
  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to review AI recipe",
    });
  }
};

export const aiRecipeActionController = async (req, res) => {
  try {
    const { id } = req.params;
    const { action } = req.body;
    const userId = req.user.userId;

    if (!["cook", "skip"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be 'cook' or 'skip' (⁠・⁠∀⁠・⁠)"
      });
    }

    const aiRecipe = await prisma.aIGeneratedRecipe.findUnique({
      where: { ai_recipe_id: parseInt(id) }
    });

    if (!aiRecipe) {
      return res.status(404).json({
        success: false,
        message: "AI Recipe not found! (; ･`д･´)"
      });
    }

    if (action === "skip") {
      const skipCount = await prisma.userAICooking.count({
        where: {
          user_id: userId,
          ingredient_key: aiRecipe.ingredient_key,
          action: "skip"
        }
      });

      const MAX_SKIP = 5;
      if (skipCount >= MAX_SKIP) {
        return res.status(400).json({
          success: false,
          message: `You have reached the skip limit (${MAX_SKIP}) for these ingredients`
        });
      }
    }

    await prisma.userAICooking.create({
      data: {
        user_id: userId,
        ai_recipe_id: aiRecipe.ai_recipe_id,
        ingredient_key: aiRecipe.ingredient_key,
        action
      }
    });

    return res.status(200).json({
      success: true,
      message: `You chose to '${action}' this AI recipe`
    });

  } catch (error) {
    console.error("[AI Recipe Action]", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record AI recipe action"
    });
  }
};

export const generateAIRecipesController = async (req, res) => {
  try {
    const { ingredients } = req.body;

    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ingredients must be a non-empty array! ʕ•̀ᆺ•́ʔ"
      });
    }

    const userId = req.user.userId;

    const result = await getAIRecipesService(ingredients, userId);

    return res.status(200).json(result);

  } catch (error) {
    console.error("[AI Recipe Controller]", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || "Failed to generate AI recipes! o(╥﹏╥)o"
    });
  }
};
