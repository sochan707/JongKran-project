export const RECIPE_PLACEHOLDER =
  "https://madeinindiarestaurant.com/img/placeholders/comfort_food_placeholder.png";

export const handleRecipeImageError = (event) => {
  event.currentTarget.onerror = null;
  event.currentTarget.src = RECIPE_PLACEHOLDER;
};