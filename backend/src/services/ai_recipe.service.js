import prisma from "../prismaClient.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const serviceError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

const parseIngredient = (rawIngredient) => {
  const rawName = typeof rawIngredient === "object" && rawIngredient !== null
    ? rawIngredient.name
    : rawIngredient;
  const name = String(rawName || "").trim().toLowerCase();

  if (!name) return null;
  if (name.length > 20) {
    throw serviceError(`Ingredient '${name}' must not exceed 20 characters`, 422);
  }

  const rawQuantity = typeof rawIngredient === "object" && rawIngredient !== null
    ? rawIngredient.quantity
    : null;
  const quantityText = String(rawQuantity || "").trim();
  const quantityMatch = quantityText.match(/\d+(?:\.\d+)?/);
  const quantity = quantityMatch ? Number(quantityMatch[0]) : 1;
  const parsedUnit = quantityMatch
    ? quantityText.slice((quantityMatch.index || 0) + quantityMatch[0].length).trim()
    : "";
  const unit = (parsedUnit || "item").slice(0, 15);

  return { name, quantity, unit };
};

const normalizeStep = (step) => {
  if (typeof step === "object" && step !== null) {
    return String(step.instruction || step.instruction_text || step.text || "").trim();
  }
  return String(step || "").trim();
};

export const reviewAIRecipeService = async (aiRecipeId, status, adminId) => {
  if (!Number.isInteger(aiRecipeId) || aiRecipeId <= 0) {
    throw serviceError("AI recipe ID must be a valid number", 400);
  }
  if (!["approved", "rejected"].includes(status)) {
    throw serviceError("Status must be approved or rejected", 400);
  }

  return prisma.$transaction(async (tx) => {
    const aiRecipe = await tx.aIGeneratedRecipe.findUnique({
      where: { ai_recipe_id: aiRecipeId },
    });

    if (!aiRecipe) throw serviceError("AI recipe not found", 404);

    if (status === "rejected") {
      if (aiRecipe.approved_recipe_id) {
        throw serviceError("An approved AI recipe cannot be rejected", 409);
      }

      return tx.aIGeneratedRecipe.update({
        where: { ai_recipe_id: aiRecipeId },
        data: { status: "rejected" },
      });
    }

    if (aiRecipe.approved_recipe_id) {
      return tx.aIGeneratedRecipe.findUnique({
        where: { ai_recipe_id: aiRecipeId },
        include: { approvedRecipe: true },
      });
    }
    if (aiRecipe.status === "rejected") {
      throw serviceError("A rejected AI recipe cannot be approved", 409);
    }

    const title = aiRecipe.title.trim();
    if (!title || title.length > 30) {
      throw serviceError("AI recipe title must contain 1 to 30 characters", 422);
    }

    const ingredients = Array.isArray(aiRecipe.ingredients)
      ? aiRecipe.ingredients.map(parseIngredient).filter(Boolean)
      : [];
    const uniqueIngredients = [...new Map(
      ingredients.map((ingredient) => [ingredient.name, ingredient])
    ).values()];
    const steps = Array.isArray(aiRecipe.steps)
      ? aiRecipe.steps.map(normalizeStep).filter(Boolean)
      : [];

    const recipe = await tx.recipe.create({
      data: {
        title,
        description: aiRecipe.description,
        image_url: aiRecipe.image_url,
        difficulty: "easy",
        prep_time: 0,
        cook_time: 0,
        servings: 1,
        created_by: adminId,
      },
    });

    for (const ingredientData of uniqueIngredients) {
      const ingredient = await tx.ingredient.upsert({
        where: { name: ingredientData.name },
        update: {},
        data: { name: ingredientData.name },
      });
      await tx.recipeIngredient.create({
        data: {
          recipe_id: recipe.recipe_id,
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredientData.quantity,
          unit: ingredientData.unit,
        },
      });
    }

    if (steps.length) {
      await tx.recipeStep.createMany({
        data: steps.map((instruction, index) => ({
          recipe_id: recipe.recipe_id,
          step_number: index + 1,
          instruction_text: instruction,
        })),
      });
    }

    await tx.logs_audit.create({
      data: {
        user_id: adminId,
        recipe_id: recipe.recipe_id,
        action_type: "approve",
      },
    });

    return tx.aIGeneratedRecipe.update({
      where: { ai_recipe_id: aiRecipeId },
      data: {
        status: "approved",
        approved_recipe_id: recipe.recipe_id,
      },
      include: { approvedRecipe: true },
    });
  });
};

export const getAIRecipesService = async (ingredients, userId) => {
  const MAX_GENERATIONS = 5;
  const GENERATION_WINDOW_MS = 3 * 60 * 60 * 1000;
  const RECIPES_PER_BATCH = 4;

  const normalizedKey = ingredients
    .map((ingredient) => String(ingredient).trim().toLowerCase())
    .filter(Boolean)
    .sort()
    .join(",");

  const windowStart = new Date(Date.now() - GENERATION_WINDOW_MS);
  const recentRequestCount = await prisma.aIGenerationRequest.count({
    where: {
      user_id: userId,
      ingredient_key: normalizedKey,
      created_at: { gte: windowStart },
    },
  });

  if (recentRequestCount >= MAX_GENERATIONS) {
    const oldestRequest = await prisma.aIGenerationRequest.findFirst({
      where: {
        user_id: userId,
        ingredient_key: normalizedKey,
        created_at: { gte: windowStart },
      },
      orderBy: { created_at: "asc" },
    });
    const resetsAt = new Date(oldestRequest.created_at.getTime() + GENERATION_WINDOW_MS);
    throw serviceError(
      `You have reached the AI generation limit (${MAX_GENERATIONS} requests every 3 hours). Try again after ${resetsAt.toISOString()}.`,
      429,
    );
  }

  const previousRequests = await prisma.aIGenerationRequest.findMany({
    where: { user_id: userId, ingredient_key: normalizedKey },
    select: { recipe_ids: true },
  });
  const previouslyShownIds = new Set(previousRequests.flatMap((request) => request.recipe_ids));

  const existingRecipes = await prisma.aIGeneratedRecipe.findMany({
    where: { ingredient_key: normalizedKey },
    orderBy: { created_at: "asc" }
  });
  const availableRecipes = existingRecipes
    .filter((recipe) => !previouslyShownIds.has(recipe.ai_recipe_id))
    .slice(0, RECIPES_PER_BATCH);

  const recipesNeeded = RECIPES_PER_BATCH - availableRecipes.length;
  if (recipesNeeded > 0) {
    const existingTitles = existingRecipes.map(r => r.title).join(", ");

    const prompt = `
      You are a chef specialized in Khmer (Cambodian) cuisine. 
      Generate ${recipesNeeded} different Khmer recipes using the following ingredients: ${ingredients.join(", ")}.
      Do NOT repeat the following recipes: ${existingTitles || "none"}.
      Return JSON ONLY as an array of ${recipesNeeded} objects, each with keys:
      {
        "title": "recipe title",
        "description": "short description",
        "ingredients": [{"name": "ingredient name", "quantity": "amount"}],
        "steps": ["step 1", "step 2", "..."]
      }
    `;

    console.log("[AI] Calling OpenAI for ingredient key:", normalizedKey);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    const text = response.choices[0].message.content;
    const jsonMatch = text.match(/\[.*\]/s);
    if (!jsonMatch) throw new Error("OpenAI returned invalid JSON");

    let aiRecipes;
    try { aiRecipes = JSON.parse(jsonMatch[0]); }
    catch { throw new Error("OpenAI returned invalid JSON"); }

    const existingTitleSet = new Set(existingRecipes.map((recipe) => recipe.title.trim().toLowerCase()));
    const newRecipes = aiRecipes
      .filter((recipe) => recipe?.title && !existingTitleSet.has(recipe.title.trim().toLowerCase()))
      .slice(0, recipesNeeded);

    for (const recipe of newRecipes) {
      const saved = await prisma.aIGeneratedRecipe.create({
        data: {
          title: recipe.title,
          description: recipe.description || null,
          ingredients: recipe.ingredients,
          steps: recipe.steps,
          generated_by: "OpenAI",
          status: "pending",
          ingredient_key: normalizedKey
        }
      });
      availableRecipes.push(saved);
    }
  }

  const recipesToReturn = availableRecipes.slice(0, RECIPES_PER_BATCH);
  if (recipesToReturn.length === 0) {
    throw serviceError("No new AI recipes could be generated", 502);
  }

  await prisma.aIGenerationRequest.create({
    data: {
      user_id: userId,
      ingredient_key: normalizedKey,
      recipe_ids: recipesToReturn.map((recipe) => recipe.ai_recipe_id),
    },
  });

  return {
    success: true,
    recipes: recipesToReturn,
    generationsRemaining: MAX_GENERATIONS - recentRequestCount - 1,
  };
};
