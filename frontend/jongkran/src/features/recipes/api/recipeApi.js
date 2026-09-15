import { apiRequest } from "../../../services/api/client";
import { normalizeRecipe } from "../lib/normalizeRecipe";

const RECIPE_CACHE_DURATION = 5 * 60 * 1000;
const recipeCache = new Map();
const recipeRequests = new Map();

const cacheRecipe = (recipe) => {
  recipeCache.set(String(recipe.id), { recipe, fetchedAt: Date.now() });
  return recipe;
};

const getRecipe = (id) => {
  const key = String(id);
  const cached = recipeCache.get(key);

  if (cached && Date.now() - cached.fetchedAt < RECIPE_CACHE_DURATION) {
    return Promise.resolve(cached.recipe);
  }

  if (!recipeRequests.has(key)) {
    const request = apiRequest(`/recipes/${id}`)
      .then((response) => cacheRecipe(normalizeRecipe(response.data)))
      .finally(() => recipeRequests.delete(key));
    recipeRequests.set(key, request);
  }

  return recipeRequests.get(key);
};

export const recipeApi = {
  list: async () =>
    (await apiRequest("/recipes")).data.map(normalizeRecipe).map(cacheRecipe),
  get: getRecipe,
  favorites: async () =>
    (await apiRequest("/favorites")).data.map((item) => normalizeRecipe(item.recipe)),
  toggleFavorite: (id) => apiRequest(`/favorites/${id}`, { method: "POST" }),
  history: async () =>
    (await apiRequest("/history")).data.map((item) => ({
      ...normalizeRecipe(item.recipe),
      completedAt: item.cooked_at,
    })),
  addHistory: (id) => apiRequest(`/history/${id}`, { method: "POST" }),
};
