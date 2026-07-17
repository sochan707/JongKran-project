import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { isAuthenticated, recipeApi } from "../lib/api";

export default function RecipeCart({
  recipe,
  matched = false,
  selectedIngredients = [],
  onFavoriteChange,
}) {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) return;
    recipeApi.favorites()
      .then((items) => setFavorite(items.some((item) => item.id === recipe.id)))
      .catch(() => {});
  }, [recipe.id]);

  // Get only the ingredient name
  const getIngredientName = (ingredient) => {
    if (typeof ingredient === "string") {
      return ingredient.toLowerCase().trim();
    }

    return (
      ingredient?.name ||
      ingredient?.ingredientName ||
      ""
    )
      .toLowerCase()
      .trim();
  };

  // Use ingredients passed from the matching page.
  // If none are passed, get them from localStorage.
  const userIngredients =
    selectedIngredients.length > 0
      ? selectedIngredients
      : JSON.parse(
          localStorage.getItem("selectedIngredients")
        ) || [];

  const recipeIngredients = recipe.ingredients || [];

  // Count how many recipe ingredients match
  const matchedIngredientCount =
    recipeIngredients.filter((recipeIngredient) => {
      const recipeIngredientName =
        getIngredientName(recipeIngredient);

      return userIngredients.some((userIngredient) => {
        const userIngredientName =
          getIngredientName(userIngredient);

        return (
          recipeIngredientName.includes(
            userIngredientName
          ) ||
          userIngredientName.includes(
            recipeIngredientName
          )
        );
      });
    }).length;

  // Calculate match percentage
  const matchPercentage =
    recipeIngredients.length > 0
      ? Math.round(
          (matchedIngredientCount /
            recipeIngredients.length) *
            100
        )
      : 0;

  const toggleFavorite = async (event) => {
    event.stopPropagation();
    if (!isAuthenticated()) {
      navigate("/login");
      return;
    }
    try {
      const result = await recipeApi.toggleFavorite(recipe.id);
      const nextFavorite = result.action === "added";
      setFavorite(nextFavorite);
      if (onFavoriteChange && !nextFavorite) {
        onFavoriteChange((items) => items.filter((item) => item.id !== recipe.id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      {/* Favorite button */}
      <button
        type="button"
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow"
      >
        <Heart
          size={20}
          className={
            favorite
              ? "fill-red-500 text-red-500"
              : "text-gray-500"
          }
        />
      </button>

      {/* Match percentage */}
      {matched && (
        <span className="absolute top-3 left-3 z-10 bg-orange-400 text-white text-xs px-3 py-1 rounded-full">
          {matchPercentage}% Matched
        </span>
      )}

      {/* Recipe card */}
      <div
        onClick={() =>
          navigate(`/recipe/${recipe.id}`)
        }
        className="cursor-pointer"
      >
        <img
          src={recipe.image}
          alt={recipe.name}
          loading="lazy"
          className="w-full h-48 md:h-64 object-cover"
        />

        <div className="p-4">
          <h3 className="text-lg font-bold">
            {recipe.name}

            {recipe.completedAt && (
              <span className="text-sm text-gray-500 font-normal">
                {" "}
                (
                {new Date(
                  recipe.completedAt
                ).toLocaleDateString("en-GB")}{" "}
                {new Date(
                  recipe.completedAt
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
                )
              </span>
            )}
          </h3>

          <p className="text-sm text-gray-500 mt-1">
            {recipe.time} min • {recipe.servings} servings
          </p>
        </div>
      </div>
    </div>
  );
}
