const API_BASE_URL = (import.meta.env.VITE_API_URL || "/api").replace(/\/$/, "");
const getValidNumber = (...values) => {
  for (const value of values) {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      continue;
    }

    const numericValue = Number(value);

    if (Number.isFinite(numericValue)) {
      return numericValue;
    }
  }

  return null;
};

export const getSession = () => {
  try {
    return JSON.parse(localStorage.getItem("authSession")) || null;
  } catch {
    return null;
  }
};

export const isAuthenticated = () => Boolean(getSession()?.accessToken);

let refreshRequest = null;

export const apiRequest = async (path, options = {}) => {
  const { retryAfterRefresh = true, ...fetchOptions } = options;
  const session = getSession();
  const headers = new Headers(fetchOptions.headers || {});

  if (fetchOptions.body && !(fetchOptions.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }
  if (session?.accessToken) {
    headers.set("Authorization", `Bearer ${session.accessToken}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });
  const payload = await response.json().catch(() => ({}));

  if (
    response.status === 401 &&
    retryAfterRefresh &&
    path !== "/auth/refresh" &&
    session?.refreshToken
  ) {
    if (!refreshRequest) {
      refreshRequest = fetch(`${API_BASE_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          refreshToken: session.refreshToken,
        }),
      }).then(async (refreshResponse) => ({
        ok: refreshResponse.ok,
        payload: await refreshResponse.json().catch(() => ({})),
      }));
    }

    let refreshResult;

    try {
      refreshResult = await refreshRequest;
    } finally {
      refreshRequest = null;
    }

    const refreshPayload = refreshResult.payload;

    if (refreshResult.ok && refreshPayload.data?.accessToken) {
      localStorage.setItem(
        "authSession",
        JSON.stringify({
          ...session,
          accessToken: refreshPayload.data.accessToken,
          refreshToken:
            refreshPayload.data.refreshToken || session.refreshToken,
        })
      );

      return apiRequest(path, {
        ...fetchOptions,
        retryAfterRefresh: false,
      });
    }

    clearSession();
  }

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
  localStorage.removeItem("userProfile");
  window.dispatchEvent(new Event("auth-change"));
};

export const clearSession = () => {
  localStorage.removeItem("authSession");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("userProfile");
  window.dispatchEvent(new Event("auth-change"));
};

export const getUserProfile = async () => {
  const response = await apiRequest("/auth/profile");
  return response.data;
};

export const updateUserProfile = async (profile, imageFile, removeImage = false) => {
  const body = new FormData();
  body.append("username", profile.username);
  body.append("email", profile.email);
  body.append("gender", profile.gender || "");
  body.append("dob", profile.dob || "");
  body.append("bio", profile.bio || "");
  body.append("removeImage", String(removeImage));
  if (imageFile) body.append("image", imageFile);

  const response = await apiRequest("/auth/profile", { method: "PATCH", body });
  return response.data;
};

export const normalizeRecipe = (recipe) => {
  const ingredientRows =
    recipe.recipeIngredients ||
    recipe.ingredients ||
    [];

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

    description:
      recipe.description ??
      recipe.recipe_description ??
      "",

    image:
      recipe.image_url ??
      recipe.image,

    time:
      Number(recipe.prep_time || 0) +
      Number(
        recipe.cook_time ??
          recipe.time ??
          0
      ),

    difficulty: recipe.difficulty
      ? `${
          recipe.difficulty
            .charAt(0)
            .toUpperCase()
        }${recipe.difficulty.slice(1)}`
      : "Easy",

    ingredients: ingredientRows
      .map((row) => {
        if (typeof row === "string") {
          return row;
        }

        return (
          row.ingredient?.name ||
          row.name ||
          row.ingredientName
        );
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
        if (typeof step === "string") {
          return step;
        }

        return (
          step.instruction_text ||
          step.instruction
        );
      })
      .filter(Boolean),

    nutrition: {
      calories: getValidNumber(
        nutritionData.calories,
        recipe.calories_per_serving
      ),

      fat: getValidNumber(
        nutritionData.fat,
        nutritionData.fat_g,
        recipe.fat_per_serving
      ),

      carbs: getValidNumber(
        nutritionData.carbs,
        nutritionData.carbohydrates,
        nutritionData.carbs_g,
        recipe.carbs_per_serving
      ),

      protein: getValidNumber(
        nutritionData.protein,
        nutritionData.protein_g,
        recipe.protein_per_serving
      ),
      estimated: Boolean(recipe.nutrition?.estimated),
      calculatedIngredientCount: getValidNumber(
        recipe.nutrition?.calculatedIngredientCount
      ),
      ingredientCount: getValidNumber(recipe.nutrition?.ingredientCount),
    },
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
