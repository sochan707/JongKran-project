import { Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getRecipeMatchPercentage } from "../lib/recipeMatching";

export default function AIRecipeCart({
  recipe,
  selectedIngredients = [],
  completedAt,
}) {
  const navigate = useNavigate();
  const matchPercentage = getRecipeMatchPercentage(recipe, selectedIngredients);
  const ingredientPreview = recipe.ingredientDetails?.slice(0, 4) || [];

  return (
    <article
      onClick={() => navigate(`/ai-recipe/${recipe.id}`)}
      className="relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-[#B9D9AE] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="flex h-48 items-center justify-center bg-[#E5F1E2]">
        <Sparkles size={52} className="text-[#468432]" />
      </div>

      <span className="absolute left-3 top-3 rounded-full bg-[#468432] px-3 py-1 text-xs font-bold text-white">
        AI Generated
      </span>
      <span className="absolute right-3 top-3 rounded-full bg-orange-400 px-3 py-1 text-xs text-white">
        {matchPercentage}% Matched
      </span>

      <div className="flex flex-1 flex-col p-5">
        <h2 className="title-font text-xl font-bold">{recipe.name}</h2>
        {completedAt && (
          <p className="mt-1 text-xs text-gray-500">
            Cooked {new Date(completedAt).toLocaleString()}
          </p>
        )}
        <p className="mt-2 line-clamp-3 text-sm text-gray-600">
          {recipe.description || "A Khmer recipe created from your ingredients."}
        </p>

        {ingredientPreview.length > 0 && (
          <p className="mt-4 text-sm text-gray-700">
            <span className="font-bold">Ingredients: </span>
            {ingredientPreview.map((item) => item.name).join(", ")}
            {recipe.ingredientDetails.length > ingredientPreview.length ? "…" : ""}
          </p>
        )}

        <div className="mt-auto pt-5">
          <span className="block w-full rounded-md bg-[#468432] px-3 py-2 text-center font-bold text-white">
            View Recipe
          </span>
        </div>
      </div>
    </article>
  );
}
