import prisma from "../prismaClient.js";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

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