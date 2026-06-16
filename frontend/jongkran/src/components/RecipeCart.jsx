import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecipeCart({ recipe, matched = false, onFavoriteChange }) {
  const navigate = useNavigate();
  const [favorite, setFavorite] = useState(false);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorite(saved.some((item) => item.id === recipe.id));
  }, [recipe.id]);

  const toggleFavorite = (e) => {
    e.stopPropagation();

    let saved = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorite) {
      saved = saved.filter((item) => item.id !== recipe.id);
      setFavorite(false);
    } else {
      saved.push({ ...recipe, favorite: true });
      setFavorite(true);
    }

    localStorage.setItem("favorites", JSON.stringify(saved));

    if (onFavoriteChange) {
      onFavoriteChange(saved);
    }
  };

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <button
        onClick={toggleFavorite}
        className="absolute top-3 right-3 z-10 bg-white rounded-full p-2 shadow"
      >
        <Heart
          size={20}
          className={favorite ? "fill-red-500 text-red-500" : "text-gray-500"}
        />
      </button>

      {matched && (
        <span className="absolute top-3 left-3 z-10 bg-orange-400 text-white text-xs px-3 py-1 rounded-full">
          80% Matched
        </span>
      )}

      <div
        onClick={() => navigate(`/recipe/${recipe.id}`)}
        className="cursor-pointer"
      >
        <img
          src={recipe.image}
          alt={recipe.name}
          className="w-full h-48 md:h-72 object-cover transition-transform duration-300 hover:scale-110"
        />

        <div className="p-4">
          <h3 className="title-font text-xl font-bold">{recipe.name}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {recipe.time} min • {recipe.servings} servings
          </p>
        </div>
      </div>
    </div>
  );
}
