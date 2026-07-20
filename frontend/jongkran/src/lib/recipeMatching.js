export const normalizeIngredientName = (ingredient) => {
  if (typeof ingredient === "string") {
    return ingredient.trim().toLowerCase();
  }

  return String(ingredient?.name || ingredient?.ingredientName || "")
    .trim()
    .toLowerCase();
};

export const ingredientsMatch = (firstIngredient, secondIngredient) => {
  const firstName = normalizeIngredientName(firstIngredient);
  const secondName = normalizeIngredientName(secondIngredient);

  return Boolean(
    firstName &&
    secondName &&
    (firstName.includes(secondName) || secondName.includes(firstName))
  );
};

const PANTRY_STAPLES = new Set([
  "salt",
  "sugar",
  "black pepper",
  "white pepper",
  "pepper",
  "cooking oil",
  "vegetable oil",
  "water",
]);

export const getRecipeMatchPercentage = (recipe, selectedIngredients) => {
  const recipeIngredients = (recipe.ingredients || []).filter(
    (ingredient) => !PANTRY_STAPLES.has(normalizeIngredientName(ingredient))
  );

  if (recipeIngredients.length === 0) {
    return 0;
  }

  const matchedCount = recipeIngredients.filter((ingredient) =>
    selectedIngredients.some((selected) => ingredientsMatch(ingredient, selected))
  ).length;

  return Math.round((matchedCount / recipeIngredients.length) * 100);
};
