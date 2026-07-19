import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest, normalizeRecipe } from "../../lib/api";
import recipeData from "../../data/recipes";
import { RECIPE_PLACEHOLDER, handleRecipeImageError, } from "../../lib/recipeImage";

export default function RecipeManagement() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const recipesPerPage = 10;

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError("");
      const result = await apiRequest("/recipes");
      setRecipes(result.data.map((recipe) => ({
        ...normalizeRecipe(recipe),
        status: "public",
        createdAt: recipe.created_at,
      })));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const filteredRecipes = recipes.filter((recipe) => {
    const searchText = input.toLowerCase().trim();

    const title = String(
      recipe.title || recipe.name || ""
    ).toLowerCase();

    const status = String(
      recipe.status || ""
    ).toLowerCase();

    return (
      title.includes(searchText) ||
      status.includes(searchText)
    );
  });

  const total = recipes.length;

  const totalPages = Math.ceil(
    filteredRecipes.length / recipesPerPage
  );

  const startIndex =
    (currentPage - 1) * recipesPerPage;

  const currentRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  const deleteRecipe = async (id) => {
    const confirmed = window.confirm(
      "Do you want to delete this recipe?"
    );

    if (!confirmed) return;

    try {
      setError("");
      await apiRequest(`/recipes/${id}`, { method: "DELETE" });
      setRecipes((current) => current.filter((recipe) => recipe.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "public") {
      return "bg-[#468432] text-white";
    }

    return "bg-[#FFA02E] text-black";
  };

  return (
    <>
      <AdminHeader />

      <div className="bg-gray-100 min-h-screen px-4 sm:px-10 pt-5 pb-10">
        <main className="mx-[25px] py-2">
          <h1 className="title-font text-3xl sm:text-4xl font-bold">
            Recipe Management
          </h1>

          <p className="mt-3 mb-5 text-gray-600">
            Manage and organize recipes for smarter
            cooking recommendations.
          </p>
        </main>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {[["Database Recipes", total]].map(([label, value]) => (
            <div
              key={label}
              className="bg-white p-6 rounded-xl shadow"
            >
              <p className="text-gray-600 text-lg font-semibold">
                {label}
              </p>

              <h2 className="text-gray-800 text-4xl font-bold mt-5">
                {value}
              </h2>
            </div>
          ))}
        </div>

        {error && <p className="mt-5 rounded-lg bg-red-100 p-4 text-red-700">{error}</p>}

        <div className="bg-white rounded-xl shadow mt-5 overflow-x-auto mb-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 p-4">
            <div className="text-2xl font-semibold">
              Recipe List
            </div>

            <div className="relative w-full lg:w-[450px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2"
                size={18}
              />

              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search recipe name or status..."
                className="w-full rounded-lg bg-gray-100 border px-4 py-3 pl-10 outline-none"
              />
            </div>
          </div>

          <table className="min-w-[750px] w-full text-left">
            <thead className="bg-[#468432] text-white">
              <tr>
                <th className="p-4 pl-10">
                  Recipe Name
                </th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-500">Loading recipes...</td></tr>
              ) : currentRecipes.length === 0 ? (
                <tr><td colSpan="4" className="p-10 text-center text-gray-500">No recipes found in the database.</td></tr>
              ) : currentRecipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  className={
                    recipe.status === "deleted"
                      ? "border-b bg-red-50 opacity-75"
                      : "border-b hover:bg-gray-50"
                  }
                >
                  <td className="p-3 flex items-center gap-3 pl-10">
                    <img
                      src={recipe.image || RECIPE_PLACEHOLDER}
                      alt={recipe.title || recipe.name || "Recipe"}
                      onError={handleRecipeImageError}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />

                    <span>
                      {recipe.title || recipe.name}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${getStatusStyle(
                        recipe.status
                      )}`}
                    >
                      {recipe.status}
                    </span>
                  </td>

                  <td className="text-gray-500 text-sm">
                    {recipe.createdAt
                      ? new Date(
                          recipe.createdAt
                        ).toLocaleDateString()
                      : "-"}
                  </td>

                  <td className="p-3">
                    <div className="flex gap-4">
                    <>
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/admin/edit/${recipe.id}`
                              )
                            }
                            className="text-[#468432] font-semibold"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              deleteRecipe(recipe.id)
                            }
                            className="text-red-600 font-semibold"
                          >
                            Delete
                          </button>
                    </>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-end gap-4 p-4">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              disabled={currentPage === 1}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              ←
            </button>

            <span className="text-sm text-gray-600">
              Page {currentPage} of {totalPages || 1}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={
                currentPage >= totalPages ||
                totalPages === 0
              }
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/create")}
          className="fixed bottom-6 right-6 bg-[#468432] text-white px-6 py-3 rounded-full shadow-lg"
        >
          + Add New Recipe
        </button>
      </div>
    </>
  );
}
