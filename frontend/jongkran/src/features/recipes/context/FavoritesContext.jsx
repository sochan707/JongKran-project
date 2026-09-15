import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getSession, isAuthenticated } from "../../../services/session";
import { recipeApi } from "../api/recipeApi";

const FavoritesContext = createContext(null);

let cachedFavorites = [];
let cachedSessionKey = null;
let favoritesLoaded = false;
let favoritesRequest = null;

const getSessionKey = () => {
  const session = getSession();
  return session?.user?.user_id ?? session?.user?.id ?? session?.user?.email ?? null;
};

const requestFavorites = (sessionKey, force = false) => {
  if (!force && favoritesLoaded && cachedSessionKey === sessionKey) {
    return Promise.resolve(cachedFavorites);
  }

  if (!favoritesRequest || favoritesRequest.sessionKey !== sessionKey) {
    const request = recipeApi
      .favorites()
      .then((favorites) => {
        cachedFavorites = favorites;
        cachedSessionKey = sessionKey;
        favoritesLoaded = true;
        return favorites;
      })
      .finally(() => {
        if (favoritesRequest?.request === request) favoritesRequest = null;
      });

    favoritesRequest = { sessionKey, request };
  }

  return favoritesRequest.request;
};

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    const sessionKey = getSessionKey();
    return cachedSessionKey === sessionKey ? cachedFavorites : [];
  });
  const [loading, setLoading] = useState(isAuthenticated);

  const refresh = useCallback(async (force = false) => {
    if (!isAuthenticated()) {
      cachedFavorites = [];
      cachedSessionKey = null;
      favoritesLoaded = false;
      setFavorites([]);
      setLoading(false);
      return [];
    }

    const sessionKey = getSessionKey();
    setLoading(true);

    try {
      const nextFavorites = await requestFavorites(sessionKey, force);
      setFavorites(nextFavorites);
      return nextFavorites;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const load = (event) => {
      if (event?.type === "auth-change") {
        cachedFavorites = [];
        cachedSessionKey = null;
        favoritesLoaded = false;
      }

      refresh(Boolean(event)).catch((error) => {
        if (active) console.error("Could not load favorites:", error);
      });
    };

    load();
    window.addEventListener("auth-change", load);

    return () => {
      active = false;
      window.removeEventListener("auth-change", load);
    };
  }, [refresh]);

  const favoriteIds = useMemo(
    () => new Set(favorites.map((recipe) => String(recipe.id))),
    [favorites],
  );

  const toggleFavorite = useCallback(async (recipe) => {
    const result = await recipeApi.toggleFavorite(recipe.id);
    const isFavorite = result.action === "added";

    setFavorites((current) => {
      const withoutRecipe = current.filter(
        (item) => String(item.id) !== String(recipe.id),
      );
      const nextFavorites = isFavorite ? [...withoutRecipe, recipe] : withoutRecipe;
      cachedFavorites = nextFavorites;
      cachedSessionKey = getSessionKey();
      favoritesLoaded = true;
      return nextFavorites;
    });

    return isFavorite;
  }, []);

  const value = useMemo(
    () => ({ favoriteIds, favorites, loading, refresh, toggleFavorite }),
    [favoriteIds, favorites, loading, refresh, toggleFavorite],
  );

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export const useFavorites = () => {
  const context = useContext(FavoritesContext);

  if (!context) {
    throw new Error("useFavorites must be used inside FavoritesProvider.");
  }

  return context;
};
