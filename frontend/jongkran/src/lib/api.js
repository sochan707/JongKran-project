// Compatibility exports keep existing pages stable while API code lives by domain.
export { apiRequest } from "../services/api/client";
export {
  clearSession,
  getSession,
  isAuthenticated,
  saveSession,
} from "../services/session";
export { getUserProfile, updateUserProfile } from "../features/auth/api/authApi";
export { recipeApi } from "../features/recipes/api/recipeApi";
export { normalizeRecipe } from "../features/recipes/lib/normalizeRecipe";
