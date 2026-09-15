const getValidNumber = (...values) => {
  for (const value of values) {
    if (value === null || value === undefined || value === "") continue;

    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) return numericValue;
  }

  return null;
};

export const normalizeRecipe = (recipe) => {
  const ingredientRows = recipe.recipeIngredients || recipe.ingredients || [];
  const recipeSteps = recipe.steps || [];
  const nutritionData =
    recipe.nutrition?.perServing ||
    recipe.nutrition?.per_serving ||
    recipe.nutrition ||
    recipe.nutritionFacts ||
    recipe.nutrition_facts ||
    {};

  return {
    ...recipe,
    id: recipe.recipe_id ?? recipe.ai_recipe_id ?? recipe.id,
    name: recipe.title ?? recipe.name,
    description: recipe.description ?? recipe.recipe_description ?? "",
    image: recipe.image_url ?? recipe.image,
    time: Number(recipe.prep_time || 0) + Number(recipe.cook_time ?? recipe.time ?? 0),
    difficulty: recipe.difficulty
      ? `${recipe.difficulty.charAt(0).toUpperCase()}${recipe.difficulty.slice(1)}`
      : "Easy",
    ingredients: ingredientRows
      .map((row) => {
        if (typeof row === "string") return row;
        return row.ingredient?.name || row.name || row.ingredientName;
      })
      .filter(Boolean),
    ingredientDetails: ingredientRows
      .filter((row) => typeof row !== "string")
      .map((row) => ({
        id: row.ingredient_id ?? row.ingredient?.ingredient_id ?? row.id,
        name: row.ingredient?.name || row.name || row.ingredientName,
        quantity: getValidNumber(row.quantity),
        quantityText: typeof row.quantity === "string" ? row.quantity : "",
        unit: row.unit || "",
      }))
      .filter((row) => row.name),
    steps: recipeSteps
      .map((step) => {
        if (typeof step === "string") return step;
        return step.instruction_text || step.instruction;
      })
      .filter(Boolean),
    nutrition: {
      calories: getValidNumber(nutritionData.calories, recipe.calories_per_serving),
      fat: getValidNumber(
        nutritionData.fat,
        nutritionData.fat_g,
        recipe.fat_per_serving,
      ),
      carbs: getValidNumber(
        nutritionData.carbs,
        nutritionData.carbohydrates,
        nutritionData.carbs_g,
        recipe.carbs_per_serving,
      ),
      protein: getValidNumber(
        nutritionData.protein,
        nutritionData.protein_g,
        recipe.protein_per_serving,
      ),
      estimated: Boolean(recipe.nutrition?.estimated),
      calculatedIngredientCount: getValidNumber(
        recipe.nutrition?.calculatedIngredientCount,
      ),
      ingredientCount: getValidNumber(recipe.nutrition?.ingredientCount),
    },
  };
};
