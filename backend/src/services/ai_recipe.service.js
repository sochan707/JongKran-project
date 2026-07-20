import prisma from "../prismaClient.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// These basic seasonings may be used by generated recipes, but they are not
// treated as user-selected ingredients when determining recipe matches.
const PANTRY_STAPLES = [
  "salt",
  "sugar",
  "black pepper",
  "white pepper",
  "pepper",
  "cooking oil",
  "vegetable oil",
  "water",
];

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

const normalizeIngredientName = (ingredient) =>
  String(ingredient?.name ?? ingredient ?? "").trim().toLowerCase();

const isAllowedGeneratedRecipe = (recipe, userIngredientSet, allowedIngredientSet) => {
  if (
    !recipe?.title?.trim() ||
    !Array.isArray(recipe.ingredients) ||
    recipe.ingredients.length === 0 ||
    !Array.isArray(recipe.steps) ||
    recipe.steps.length === 0
  ) {
    return false;
  }

  const generatedIngredientNames = recipe.ingredients
    .map(normalizeIngredientName)
    .filter(Boolean);

  return (
    generatedIngredientNames.length === recipe.ingredients.length &&
    generatedIngredientNames.every((name) => allowedIngredientSet.has(name)) &&
    generatedIngredientNames.some((name) => userIngredientSet.has(name))
  );
};

export const getAIRecipeForUserService = async (aiRecipeId, userId) => {
  if (!Number.isInteger(aiRecipeId) || aiRecipeId <= 0) {
    throw serviceError("AI recipe ID must be a valid number", 400);
  }

  const hasAccess = await prisma.aIGenerationRequest.findFirst({
    where: {
      user_id: userId,
      recipe_ids: { has: aiRecipeId },
    },
    select: { id: true },
  });

  const hasCooked = hasAccess
    ? null
    : await prisma.userAICooking.findFirst({
        where: { user_id: userId, ai_recipe_id: aiRecipeId },
        select: { id: true },
      });

  if (!hasAccess && !hasCooked) {
    throw serviceError("AI recipe not found", 404);
  }

  const recipe = await prisma.aIGeneratedRecipe.findUnique({
    where: { ai_recipe_id: aiRecipeId },
  });

  if (!recipe) throw serviceError("AI recipe not found", 404);

  return recipe;
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
    if (!title) {
      throw serviceError("AI recipe title is required", 422);
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
        create: { name: ingredientData.name },
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

  const normalizedUserIngredients = [...new Set(
    ingredients
      .map((ingredient) => String(ingredient).trim().toLowerCase())
      .filter(Boolean)
  )];
  const userIngredientSet = new Set(normalizedUserIngredients);

  if (normalizedUserIngredients.length === 0) {
    throw serviceError("At least one valid user ingredient is required", 400);
  }

  const allowedIngredients = [...new Set([
    ...normalizedUserIngredients,
    ...PANTRY_STAPLES,
  ])];
  const allowedIngredientSet = new Set(allowedIngredients);

  const normalizedKey = normalizedUserIngredients
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
    .filter((recipe) =>
      isAllowedGeneratedRecipe(recipe, userIngredientSet, allowedIngredientSet)
    )
    .filter((recipe) => !previouslyShownIds.has(recipe.ai_recipe_id))
    .slice(0, RECIPES_PER_BATCH);

  const recipesNeeded = RECIPES_PER_BATCH - availableRecipes.length;
  if (recipesNeeded > 0) {
    const existingTitles = existingRecipes.map(r => r.title).join(", ");

    const prompt = `
You are a chef specializing in Khmer (Cambodian) cuisine.

Create up to ${recipesNeeded} different recipes.

USER INGREDIENTS (the main food ingredients):
${JSON.stringify(normalizedUserIngredients)}

OPTIONAL PANTRY STAPLES (may be used, but do not count as user ingredients):
${JSON.stringify(PANTRY_STAPLES)}

STRICT RULES:
1. Use only exact ingredient names from USER INGREDIENTS or OPTIONAL PANTRY STAPLES.
2. Never add, substitute, infer, garnish with, serve with, or recommend any other ingredient.
3. This restriction also applies to every ingredient mentioned in descriptions and cooking steps.
4. Every ingredient mentioned in a description or step must appear in that recipe's ingredients array.
5. Every recipe must use at least one USER INGREDIENT. Pantry staples alone are not sufficient.
6. Do not repeat these existing recipe titles: ${existingTitles || "none"}.
7. If fewer than ${recipesNeeded} valid Khmer recipes can be made, return fewer recipes instead of inventing ingredients.
8. Ingredient names must use the exact lowercase spelling supplied in the allowed lists.
`;

    console.log("[AI] Calling OpenAI for ingredient key:", normalizedKey);

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "khmer_recipe_batch",
          strict: true,
          schema: {
            type: "object",
            properties: {
              recipes: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    description: { type: "string" },
                    ingredients: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          name: { type: "string", enum: allowedIngredients },
                          quantity: { type: "string" },
                        },
                        required: ["name", "quantity"],
                        additionalProperties: false,
                      },
                    },
                    steps: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                  required: ["title", "description", "ingredients", "steps"],
                  additionalProperties: false,
                },
              },
            },
            required: ["recipes"],
            additionalProperties: false,
          },
        },
      },
    });

    const text = response.choices[0].message.content;
    if (!text) throw new Error("OpenAI did not return a recipe response");

    let aiRecipes;
    try { aiRecipes = JSON.parse(text).recipes; }
    catch { throw new Error("OpenAI returned invalid JSON"); }
    if (!Array.isArray(aiRecipes)) {
      throw new Error("OpenAI returned an invalid recipe list");
    }

    const existingTitleSet = new Set(existingRecipes.map((recipe) => recipe.title.trim().toLowerCase()));
    const newRecipes = aiRecipes
      .filter((recipe) =>
        isAllowedGeneratedRecipe(recipe, userIngredientSet, allowedIngredientSet)
      )
      .filter((recipe) => !existingTitleSet.has(recipe.title.trim().toLowerCase()))
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
