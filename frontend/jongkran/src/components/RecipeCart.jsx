import { Heart } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function RecipeCart({ recipe, matched = false }) {
  const [favorite, setFavorite] = useState(recipe?.favorite || false);
  const navigate = useNavigate();

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-transform duration-300 hover:scale-105 hover:shadow-lg">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setFavorite(!favorite);
        }}
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
