import { useCallback, useEffect, useState } from "react";
import { recipeApi } from "../api/recipeApi";

const CACHE_DURATION = 5 * 60 * 1000;
const listeners = new Set();

let recipeState = {
  recipes: [],
  loading: true,
  error: "",
  fetchedAt: 0,
  request: null,
};

const publish = (changes) => {
  recipeState = { ...recipeState, ...changes };
  listeners.forEach((listener) => listener(recipeState));
};

const loadRecipes = (force = false) => {
  const isFresh = Date.now() - recipeState.fetchedAt < CACHE_DURATION;
  if (!force && isFresh) return Promise.resolve(recipeState.recipes);
  if (recipeState.request) return recipeState.request;

  publish({ loading: recipeState.recipes.length === 0, error: "" });

  const request = recipeApi
    .list()
    .then((recipes) => {
      publish({ recipes, loading: false, error: "", fetchedAt: Date.now() });
      return recipes;
    })
    .catch((error) => {
      publish({ loading: false, error: error.message });
      throw error;
    })
    .finally(() => {
      recipeState = { ...recipeState, request: null };
    });

  recipeState = { ...recipeState, request };
  return request;
};

export default function useRecipes() {
  const [state, setState] = useState(recipeState);

  useEffect(() => {
    listeners.add(setState);
    loadRecipes().catch(() => {});
    return () => listeners.delete(setState);
  }, []);

  const refresh = useCallback(() => loadRecipes(true), []);

  return { ...state, refresh };
}
