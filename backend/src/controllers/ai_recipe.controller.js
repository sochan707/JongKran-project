import { getAIRecipesService } from "../services/ai_recipe.service.js";
import prisma from "../prismaClient.js";

export const getPendingAIRecipesController = async (_req, res) => {
  const recipes = await prisma.aiGeneratedRecipe.findMany({
    where: { status: "pending" },
    orderBy: { created_at: "desc" },
  });
  return res.json({ success: true, data: recipes });
};

export const reviewAIRecipeController = async (req, res) => {
  const status = req.body.status;
  if (!["approved", "rejected"].includes(status)) {
    return res.status(400).json({ success: false, message: "Status must be approved or rejected" });
  }
  const recipe = await prisma.aiGeneratedRecipe.update({
    where: { ai_recipe_id: Number(req.params.id) },
    data: { status },
  });
  return res.json({ success: true, data: recipe });
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

    const aiRecipe = await prisma.aiGeneratedRecipe.findUnique({
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

    return res.status(500).json({
      success: false,
      message: "Failed to generate AI recipes! o(╥﹏╥)o"
    });
  }
};
