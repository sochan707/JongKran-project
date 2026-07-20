import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest } from "../../lib/api";
import { RECIPE_PLACEHOLDER, handleRecipeImageError } from "../../lib/recipeImage";

export default function ViewPendingAIRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    apiRequest(`/ai-recipes/pending/${id}`)
      .then((result) => setRecipe(result.data))
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [id]);

  const reviewRecipe = async (status) => {
    setProcessing(true);
    setError("");

    try {
      await apiRequest(`/ai-recipes/${id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      navigate("/admin/pending-approve", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
      setProcessing(false);
    }
  };

  const ingredients = Array.isArray(recipe?.ingredients) ? recipe.ingredients : [];
  const steps = Array.isArray(recipe?.steps) ? recipe.steps : [];

  return (
    <>
      <AdminHeader />
      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <main className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow md:p-8">
          <h1 className="mb-6 text-4xl font-bold">View AI Recipe</h1>

          {loading ? (
            <p className="py-12 text-center text-gray-500">Loading AI recipe...</p>
          ) : !recipe ? (
            <div className="py-12 text-center">
              <p className="text-lg font-semibold text-red-600">{error || "AI recipe not found."}</p>
              <button type="button" onClick={() => navigate("/admin/pending-approve")} className="mt-4 font-medium text-[#468432] underline">
                Back to Pending Recipes
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {error && <p role="alert" className="rounded-lg bg-red-100 p-4 text-red-700">{error}</p>}

              <section className="rounded-xl border border-[#468432] p-6 shadow">
                <div className="mb-4 flex items-center justify-between gap-4">
                  <p className="text-xl font-medium">Recipe Title</p>
                  <span
                    className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${
                      recipe.status === "approved"
                        ? "bg-[#468432]"
                        : recipe.status === "rejected"
                          ? "bg-red-600"
                          : "bg-yellow-500"
                    }`}
                  >
                    {recipe.status === "approved" ? "Approved" : recipe.status === "rejected" ? "Rejected" : "Pending"}
                  </span>
                </div>
                <div className="rounded-lg border bg-gray-50 p-3">{recipe.title}</div>

                {recipe.description && (
                  <>
                    <p className="mb-2 mt-6 text-xl font-medium">Description</p>
                    <div className="whitespace-pre-wrap rounded-lg border bg-gray-50 p-3">{recipe.description}</div>
                  </>
                )}

                <img src={recipe.image_url || RECIPE_PLACEHOLDER} alt={recipe.title || "AI recipe"} onError={handleRecipeImageError} className="mt-6 h-[300px] w-full rounded-[40px] object-cover" />
              </section>

              <section className="rounded-lg border border-[#468432] p-4">
                <h2 className="mb-4 text-xl font-semibold">Ingredients</h2>
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="rounded-lg border bg-gray-50 p-3">
                      {typeof ingredient === "string" ? ingredient : ingredient.name}
                      {typeof ingredient === "object" && ingredient.quantity ? ` — ${ingredient.quantity}` : ""}
                    </div>
                  ))}
                  {!ingredients.length && <p className="text-gray-500">No ingredients available.</p>}
                </div>
              </section>

              <section className="rounded-lg border border-[#468432] p-4">
                <h2 className="mb-4 text-xl font-semibold">Cooking Steps</h2>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div key={index} className="rounded-lg border bg-gray-50 p-3">
                      <span className="font-semibold">Step {index + 1}: </span>
                      {typeof step === "string" ? step : step.instruction || step.instruction_text || step.text}
                    </div>
                  ))}
                  {!steps.length && <p className="text-gray-500">No cooking steps available.</p>}
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
                <button type="button" onClick={() => navigate("/admin/pending-approve")} disabled={processing} className="rounded-lg border border-[#468432] px-6 py-3 font-semibold text-[#468432] disabled:opacity-50">Back</button>
                {recipe.status === "pending" && (
                  <>
                    <button type="button" onClick={() => reviewRecipe("rejected")} disabled={processing} className="rounded-lg bg-red-600 px-6 py-3 font-semibold text-white disabled:opacity-50">Reject</button>
                    <button type="button" onClick={() => reviewRecipe("approved")} disabled={processing} className="rounded-lg bg-[#468432] px-6 py-3 font-semibold text-white disabled:opacity-50">{processing ? "Processing..." : "Publish"}</button>
                  </>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
