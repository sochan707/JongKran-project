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
    const aiRecipe = await tx.aiGeneratedRecipe.findUnique({
      where: { ai_recipe_id: aiRecipeId },
    });

    if (!aiRecipe) throw serviceError("AI recipe not found", 404);

    if (status === "rejected") {
      if (aiRecipe.approved_recipe_id) {
        throw serviceError("An approved AI recipe cannot be rejected", 409);
      }

      return tx.aiGeneratedRecipe.update({
        where: { ai_recipe_id: aiRecipeId },
        data: { status: "rejected" },
      });
    }

    if (aiRecipe.approved_recipe_id) {
      return tx.aiGeneratedRecipe.findUnique({
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

    return tx.aiGeneratedRecipe.update({
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
  const MAX_SKIP = 5;

  const normalizedKey = ingredients
    .map(i => i.trim().toLowerCase())
    .sort()
    .join(",");

  let existingRecipes = await prisma.aiGeneratedRecipe.findMany({
    where: { ingredient_key: normalizedKey },
    orderBy: { created_at: "asc" }
  });

  const userSkipped = await prisma.userAICooking.findMany({
    where: { user_id: userId, ingredient_key: normalizedKey, action: "skip" },
    select: { ai_recipe_id: true }
  });
  const skippedIds = userSkipped.map(s => s.ai_recipe_id);

  let availableRecipes = existingRecipes.filter(r => !skippedIds.includes(r.ai_recipe_id));

  if (userSkipped.length >= MAX_SKIP && availableRecipes.length === 0) {
    return { success: true, message: `You have reached the skip limit (${MAX_SKIP}) for these ingredients.`, recipes: [] };
  }

  if (availableRecipes.length === 0) {
    const existingTitles = existingRecipes.map(r => r.title).join(", ");

    const prompt = `
      You are a chef specialized in Khmer (Cambodian) cuisine. 
      Generate 4 different Khmer recipes using the following ingredients: ${ingredients.join(", ")}.
      Do NOT repeat the following recipes: ${existingTitles || "none"}.
      Return JSON ONLY as an array of 4 objects, each with keys:
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

    const newRecipes = aiRecipes.filter(r => !existingRecipes.find(er => er.title === r.title));

    const savedRecipes = [];
    for (const recipe of newRecipes) {
      const saved = await prisma.aiGeneratedRecipe.create({
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
      savedRecipes.push(saved);
    }

    availableRecipes = savedRecipes;
  }

  const recipesToReturn = availableRecipes.slice(0, 4);

  return { success: true, recipes: recipesToReturn };
};