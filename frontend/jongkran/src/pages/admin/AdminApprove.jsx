import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest } from "../../lib/api";
import { RECIPE_PLACEHOLDER, handleRecipeImageError, } from "../../lib/recipeImage";

export default function AdminApprove() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState(null);

  const recipesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    apiRequest("/ai-recipes/pending")
      .then((result) => setRecipes(result.data.map((recipe) => ({ ...recipe, id: recipe.ai_recipe_id, image: recipe.image_url, createdAt: recipe.created_at }))))
      .catch((error) => setMessage({ type: "error", text: error.message }))
      .finally(() => setLoading(false));
  }, []);

  const filteredRecipes = recipes.filter((recipe) =>
    recipe.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(
    filteredRecipes.length / recipesPerPage
  );

  const start = (currentPage - 1) * recipesPerPage;

  const currentRecipes = filteredRecipes.slice(
    start,
    start + recipesPerPage
  );

  const approveRecipe = async (id) => {
    setProcessingId(id);
    setMessage(null);

    try {
      const result = await apiRequest(`/ai-recipes/${id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ status: "approved" }),
      });
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
      setMessage({
        type: "success",
        text: result.message || "Recipe approved and published successfully.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setProcessingId(null);
    }
  };

  const rejectRecipe = async (id) => {
    setProcessingId(id);
    setMessage(null);

    try {
      const result = await apiRequest(`/ai-recipes/${id}/review`, {
        method: "PATCH",
        body: JSON.stringify({ status: "rejected" }),
      });
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
      setMessage({
        type: "success",
        text: result.message || "AI recipe rejected.",
      });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="bg-gray-100 min-h-screen pl-10 pr-10 pt-5 pb-10">
        <main className="mx-[25px] py-2">
          <h1 className="title-font text-5xl font-bold">
            AI Generated Recipes
          </h1>

          <p className="mt-3 mb-5 text-gray-600">
            Review AI-generated recipes. Approved recipes are published to the regular recipe list.
          </p>

          {message && (
            <div
              role="status"
              className={`mb-5 rounded-lg border px-4 py-3 ${
                message.type === "success"
                  ? "border-green-200 bg-green-50 text-green-800"
                  : "border-red-200 bg-red-50 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}
        </main>

        <div className="bg-white rounded-xl shadow overflow-x-auto">

          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4">

            <div className="text-2xl font-semibold">
              Pending Recipes
            </div>

            <div className="relative w-full sm:w-2/3 md:w-2/3 lg:w-[450px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={18}
              />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search recipe..."
                className="w-full rounded-lg bg-gray-100 border px-4 py-3 pl-10"
              />
            </div>

          </div>

          <table className="min-w-[700px] w-full">

            <thead className="bg-[#468432] text-white">
              <tr>
                <th className="p-4 pl-10 text-left">Recipe</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading && currentRecipes.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No pending AI recipes found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    Loading pending recipes...
                  </td>
                </tr>
              )}

              {currentRecipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 pl-10 flex items-center gap-3">
                    <img
                      src={recipe.image || RECIPE_PLACEHOLDER}
                      alt={recipe.title || "Recipe"}
                      onError={handleRecipeImageError}
                      className="w-12 h-12 rounded object-cover"
                    />

                    {recipe.title}
                  </td>

                  <td>
                    <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs">
                      Pending
                    </span>
                  </td>

                  <td>{recipe.createdAt}</td>

                  <td>
                    <div className="flex gap-3">
                      <button
                        onClick={() => approveRecipe(recipe.id)}
                        disabled={processingId !== null}
                        className="text-[#468432] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === recipe.id ? "Processing..." : "Publish"}
                      </button>

                      <button
                        onClick={() => rejectRecipe(recipe.id)}
                        disabled={processingId !== null}
                        className="text-red-600 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === recipe.id ? "Processing..." : "Reject"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

          <div className="flex justify-end gap-4 p-4">

            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="border rounded px-3 py-1"
            >
              ←
            </button>

            <span>
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="border rounded px-3 py-1"
            >
              →
            </button>

          </div>

        </div>
      </div>
    </>
  );
}
