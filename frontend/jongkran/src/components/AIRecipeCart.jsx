import { ChefHat, Sparkles } from "lucide-react";
import { getRecipeMatchPercentage } from "../lib/recipeMatching";

export default function AIRecipeCart({
  recipe,
  selectedIngredients = [],
  busy = false,
  onCook,
}) {
  const matchPercentage = getRecipeMatchPercentage(recipe, selectedIngredients);
  const ingredientPreview = recipe.ingredientDetails?.slice(0, 4) || [];

  return (
    <article className="relative flex flex-col overflow-hidden rounded-xl border border-[#B9D9AE] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
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
          <button
            type="button"
            disabled={busy}
            onClick={() => onCook(recipe)}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#468432] px-3 py-2 font-bold text-white transition hover:bg-[#1A5C05] disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            <ChefHat size={18} /> Cook
          </button>
        </div>
      </div>
    </article>
  );
}
