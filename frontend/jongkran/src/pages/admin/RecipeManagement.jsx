import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import recipeData from "../../data/recipes";
import { RECIPE_PLACEHOLDER, handleRecipeImageError, } from "../../lib/recipeImage";


export default function RecipeManagement() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState("");

  const recipesPerPage = 10;

  const sortRecipes = (recipeList) => {
    return [...recipeList].sort((a, b) => {
      if (
        a.status === "deleted" &&
        b.status !== "deleted"
      ) {
        return 1;
      }

      if (
        a.status !== "deleted" &&
        b.status === "deleted"
      ) {
        return -1;
      }

      return 0;
    });
  };

  const loadRecipes = () => {
    const localRecipes =
      JSON.parse(localStorage.getItem("recipes")) || [];

    const formattedRecipes = recipeData.map((recipe) => ({
      ...recipe,
      title: recipe.title || recipe.name,
      status: recipe.status || "public",
      createdAt: recipe.createdAt || "2026-07-06",
    }));

    const recipeMap = new Map();

    formattedRecipes.forEach((recipe) => {
      recipeMap.set(String(recipe.id), recipe);
    });

    localRecipes.forEach((recipe) => {
      const originalRecipe = recipeMap.get(
        String(recipe.id)
      );

      recipeMap.set(String(recipe.id), {
        ...originalRecipe,
        ...recipe,
      });
    });

    setRecipes(
      sortRecipes(Array.from(recipeMap.values()))
    );
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

  const pending = recipes.filter(
    (recipe) => recipe.status === "pending"
  ).length;

  const published = recipes.filter(
    (recipe) => recipe.status === "public"
  ).length;

  const aiGenerated = recipes.filter(
    (recipe) => recipe.status === "ai_generated"
  ).length;

  const deleted = recipes.filter(
    (recipe) => recipe.status === "deleted"
  ).length;

  const totalPages = Math.ceil(
    filteredRecipes.length / recipesPerPage
  );

  const startIndex =
    (currentPage - 1) * recipesPerPage;

  const currentRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  const saveRecipeToLocalStorage = (changedRecipe) => {
    const localRecipes =
      JSON.parse(localStorage.getItem("recipes")) || [];

    const exists = localRecipes.some(
      (recipe) =>
        String(recipe.id) === String(changedRecipe.id)
    );

    const updatedRecipes = exists
      ? localRecipes.map((recipe) =>
          String(recipe.id) ===
          String(changedRecipe.id)
            ? changedRecipe
            : recipe
        )
      : [...localRecipes, changedRecipe];

    localStorage.setItem(
      "recipes",
      JSON.stringify(updatedRecipes)
    );
  };

  const softDelete = (id) => {
    const confirmed = window.confirm(
      "Do you want to delete this recipe?"
    );

    if (!confirmed) return;

    const recipeToDelete = recipes.find(
      (recipe) => String(recipe.id) === String(id)
    );

    if (!recipeToDelete) return;

    const deletedRecipe = {
      ...recipeToDelete,
      previousStatus:
        recipeToDelete.status === "deleted"
          ? recipeToDelete.previousStatus
          : recipeToDelete.status,
      status: "deleted",
      deletedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveRecipeToLocalStorage(deletedRecipe);

    setRecipes(
      sortRecipes(
        recipes.map((recipe) =>
          String(recipe.id) === String(id)
            ? deletedRecipe
            : recipe
        )
      )
    );
  };

  const restoreRecipe = (id) => {
    const confirmed = window.confirm(
      "Do you want to restore this recipe?"
    );

    if (!confirmed) return;

    const recipeToRestore = recipes.find(
      (recipe) => String(recipe.id) === String(id)
    );

    if (!recipeToRestore) return;

    const restoredRecipe = {
      ...recipeToRestore,
      status:
        recipeToRestore.previousStatus || "public",
      previousStatus: null,
      deletedAt: null,
      updatedAt: new Date().toISOString(),
    };

    saveRecipeToLocalStorage(restoredRecipe);

    setRecipes(
      sortRecipes(
        recipes.map((recipe) =>
          String(recipe.id) === String(id)
            ? restoredRecipe
            : recipe
        )
      )
    );
  };

  const getStatusStyle = (status) => {
    if (status === "public") {
      return "bg-[#468432] text-white";
    }

    if (status === "deleted") {
      return "bg-red-600 text-white";
    }

    if (status === "ai_generated") {
      return "bg-blue-600 text-white";
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
          {[
            ["Total Recipes", total],
            ["Pending Recipes", pending],
            ["Published Recipes", published],
            ["AI Generated", aiGenerated],
            ["Deleted Recipes", deleted],
          ].map(([label, value]) => (
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
              {currentRecipes.map((recipe) => (
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
                      {recipe.status === "deleted" ? (
                        <button
                          type="button"
                          onClick={() =>
                            restoreRecipe(recipe.id)
                          }
                          className="text-blue-600 font-semibold"
                        >
                          Restore
                        </button>
                      ) : (
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
                              softDelete(recipe.id)
                            }
                            className="text-red-600 font-semibold"
                          >
                            Delete
                          </button>
                        </>
                      )}
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