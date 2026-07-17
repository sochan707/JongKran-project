const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem("authSession")) || null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getSession()?.accessToken);

export const apiRequest = async (path, options = {}) => {
  const session = getSession();
  const headers = new Headers(options.headers || {});

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(payload.message || "The server could not complete the request.");
  }

  return payload;
};

export const saveSession = (data) => {
  const session = {
    user: data.user,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken,
  };
  localStorage.setItem("authSession", JSON.stringify(session));
  localStorage.setItem("isLoggedIn", "true");
  localStorage.setItem("userProfile", JSON.stringify({
    username: data.user?.user_name || data.user?.email?.split("@")[0] || "User",
    email: data.user?.email,
  }));
  window.dispatchEvent(new Event("auth-change"));
};

export const clearSession = () => {
  localStorage.removeItem("authSession");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userProfile");
  window.dispatchEvent(new Event("auth-change"));
};

export const normalizeRecipe = (recipe) => {
  const ingredientRows = recipe.recipeIngredients || recipe.ingredients || [];
  const steps = recipe.steps || [];

  return {
    ...recipe,
    id: recipe.recipe_id ?? recipe.id,
    name: recipe.title ?? recipe.name,
    image: recipe.image_url ?? recipe.image,
    time: (recipe.prep_time ?? 0) + (recipe.cook_time ?? recipe.time ?? 0),
    difficulty: recipe.difficulty
      ? `${recipe.difficulty.charAt(0).toUpperCase()}${recipe.difficulty.slice(1)}`
      : "Easy",
    ingredients: ingredientRows.map((row) =>
      typeof row === "string"
        ? row
        : row.ingredient?.name || row.name || row.ingredientName
    ).filter(Boolean),
    steps: steps.map((step) =>
      typeof step === "string" ? step : step.instruction_text
    ).filter(Boolean),
  };
};

export const recipeApi = {
  list: async () => (await apiRequest("/recipes")).data.map(normalizeRecipe),
  get: async (id) => normalizeRecipe((await apiRequest(`/recipes/${id}`)).data),
  favorites: async () => (await apiRequest("/favorites")).data.map((item) => normalizeRecipe(item.recipe)),
  toggleFavorite: (id) => apiRequest(`/favorites/${id}`, { method: "POST" }),
  history: async () => (await apiRequest("/history")).data.map((item) => ({
    ...normalizeRecipe(item.recipe),
    completedAt: item.cooked_at,
  })),
  addHistory: (id) => apiRequest(`/history/${id}`, { method: "POST" }),
};
