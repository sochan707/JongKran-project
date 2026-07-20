import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest } from "../../lib/api";
import {
  RECIPE_PLACEHOLDER,
  handleRecipeImageError,
} from "../../lib/recipeImage";

export default function ViewRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    apiRequest(`/recipes/${id}`)
      .then((result) => {
        if (active) setRecipe(result.data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || "Recipe not found.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [id]);

  const ingredients = recipe?.recipeIngredients || [];
  const steps = recipe?.steps || [];

  return (
    <>
      <AdminHeader />

      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <main className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow md:p-8">
          <h1 className="mb-6 text-4xl font-bold">View Recipe</h1>

          {loading ? (
            <p className="py-12 text-center text-gray-500">Loading recipe...</p>
          ) : error || !recipe ? (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold text-red-600">
                {error || "Recipe not found."}
              </p>
              <button
                type="button"
                onClick={() => navigate("/admin")}
                className="mt-4 font-medium text-[#468432] underline"
              >
                Back to Recipe Management
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <section className="rounded-xl border border-[#468432] bg-white p-6 shadow">
                <div>
                  <p className="mb-2 text-xl font-medium">Recipe Title</p>
                  <div className="rounded-lg border bg-gray-50 p-3 text-gray-800">
                    {recipe.title || "Untitled Recipe"}
                  </div>
                </div>

                {recipe.description && (
                  <div className="mt-6">
                    <p className="mb-2 text-xl font-medium">Description</p>
                    <div className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-3 text-gray-800">
                      {recipe.description}
                    </div>
                  </div>
                )}

                <img
                  src={recipe.image_url || RECIPE_PLACEHOLDER}
                  alt={recipe.title || "Recipe"}
                  onError={handleRecipeImageError}
                  className="mt-6 h-[300px] w-full rounded-[40px] object-cover"
                />
              </section>

              <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {[
                  ["Prep Time", `${recipe.prep_time ?? 0} min`],
                  ["Cooking Time", `${recipe.cook_time ?? 0} min`],
                  ["Servings", recipe.servings ?? "-"],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-lg border border-[#468432] p-4">
                    <p className="mb-2 font-medium">{label}</p>
                    <div className="rounded-lg border bg-gray-50 p-3 text-gray-800">
                      {value}
                    </div>
                  </div>
                ))}
              </section>

              <section className="rounded-lg border border-[#468432] p-4">
                <h2 className="mb-4 text-xl font-semibold">Ingredients</h2>
                {ingredients.length ? (
                  <div className="space-y-3">
                    {ingredients.map((item, index) => (
                      <div key={item.ingredient_id || index} className="rounded-lg border bg-gray-50 p-3">
                        {item.ingredient?.name || item.name || `Ingredient ${index + 1}`}
                        {item.quantity != null && ` — ${Number(item.quantity)} ${item.unit || ""}`}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No ingredients available.</p>
                )}
              </section>

              <section className="rounded-lg border border-[#468432] p-4">
                <h2 className="mb-4 text-xl font-semibold">Cooking Steps</h2>
                {steps.length ? (
                  <div className="space-y-3">
                    {steps.map((step, index) => (
                      <div key={step.step_id || index} className="rounded-lg border bg-gray-50 p-3">
                        <span className="font-semibold">Step {step.step_number || index + 1}: </span>
                        {step.instruction_text || step.instruction}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No cooking steps available.</p>
                )}
              </section>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/admin")}
                  className="rounded-lg border border-[#468432] px-6 py-3 font-semibold text-[#468432] transition hover:bg-green-50"
                >
                  Back
                </button>
                <button
                  type="button"
                  onClick={() => navigate(`/admin/edit/${id}`)}
                  className="rounded-lg bg-[#FFA02E] px-6 py-3 font-semibold text-black transition hover:bg-[#e89120]"
                >
                  Edit Recipe
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
