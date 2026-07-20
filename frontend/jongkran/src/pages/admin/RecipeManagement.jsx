import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

import AdminHeader from "../../components/AdminHeader";
import { apiRequest, normalizeRecipe } from "../../lib/api";
import {
  RECIPE_PLACEHOLDER,
  handleRecipeImageError,
} from "../../lib/recipeImage";

export default function RecipeManagement() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletedCount, setDeletedCount] = useState(0);
  const [aiRecipeStats, setAIRecipeStats] = useState({
    pendingCount: 0,
    publishedCount: 0,
  });

  const recipesPerPage = 10;

  const normalizeStatus = (recipe) => {
    const isAIGenerated =
      recipe.is_ai_generated === true ||
      recipe.isAiGenerated === true ||
      String(recipe.generated_by || "").toLowerCase() === "ai" ||
      String(recipe.source || "").toLowerCase() === "ai";

    if (isAIGenerated) {
      return "ai_generated";
    }

    const status = String(
      recipe.status ||
        recipe.recipe_status ||
        recipe.recipeStatus ||
        "public"
    )
      .trim()
      .toLowerCase();

    if (status === "published") {
      return "public";
    }

    if (status === "ai generated") {
      return "ai_generated";
    }

    return status;
  };

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

      const dateA = new Date(
        a.createdAt || 0
      ).getTime();

      const dateB = new Date(
        b.createdAt || 0
      ).getTime();

      return dateB - dateA;
    });
  };

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError("");

      const [result, deletedCountResult, aiStatsResult] = await Promise.all([
        apiRequest("/recipes"),
        apiRequest("/recipes/admin/deleted-count"),
        apiRequest("/ai-recipes/admin/stats"),
      ]);

      const recipeList = Array.isArray(result)
        ? result
        : Array.isArray(result.data)
          ? result.data
          : [];

      const formattedRecipes = recipeList.map(
        (recipe) => ({
          ...normalizeRecipe(recipe),

          // Keep the original database fields if normalizeRecipe
          // does not return them.
          id:
            recipe.recipe_id ||
            recipe.id,

          title:
            recipe.title ||
            recipe.name ||
            "Untitled Recipe",

          status: normalizeStatus(recipe),

          createdAt:
            recipe.created_at ||
            recipe.createdAt ||
            recipe.updated_at ||
            recipe.updatedAt ||
            null,
        })
      );

      setRecipes(sortRecipes(formattedRecipes));
      setDeletedCount(Number(deletedCountResult.data?.count) || 0);
      setAIRecipeStats({
        pendingCount: Number(aiStatsResult.data?.pendingCount) || 0,
        publishedCount: Number(aiStatsResult.data?.publishedCount) || 0,
      });
    } catch (err) {
      console.error("Failed to load recipes:", err);

      setError(
        err.message ||
          "Could not load recipes. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecipes();
  }, []);

  const searchText = input.toLowerCase().trim();

  const filteredRecipes = recipes.filter((recipe) => {
    const title = String(
      recipe.title || recipe.name || ""
    ).toLowerCase();

    const status = String(
      recipe.status || ""
    )
      .replaceAll("_", " ")
      .toLowerCase();

    return (
      title.includes(searchText) ||
      status.includes(searchText)
    );
  });

  // Dashboard values
  const total = recipes.length;

  const published = recipes.filter(
    (recipe) => recipe.status === "public"
  ).length;

  const summaryCards = [
    {
      label: "Total Recipes",
      value: total,
    },
    {
      label: "Pending Recipes",
      value: aiRecipeStats.pendingCount,
    },
    {
      label: "Published Recipes",
      value: published,
    },
    {
      label: "AI Generated",
      value: aiRecipeStats.publishedCount,
    },
    {
      label: "Deleted Recipes",
      value: deletedCount,
    },
  ];

  const totalPages = Math.ceil(
    filteredRecipes.length / recipesPerPage
  );

  const validCurrentPage = Math.min(
    currentPage,
    Math.max(totalPages, 1)
  );

  const startIndex =
    (validCurrentPage - 1) * recipesPerPage;

  const currentRecipes = filteredRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  const deleteRecipe = async (id) => {
    const confirmed = window.confirm(
      "Do you want to delete this recipe?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setError("");

      await apiRequest(`/recipes/${id}`, {
        method: "DELETE",
      });

      setRecipes((currentRecipesList) =>
        currentRecipesList.filter(
          (recipe) =>
            String(recipe.id) !== String(id)
        )
      );
      setDeletedCount((count) => count + 1);

      const remainingItems =
        filteredRecipes.length - 1;

      const remainingPages = Math.ceil(
        remainingItems / recipesPerPage
      );

      if (
        currentPage > remainingPages &&
        currentPage > 1
      ) {
        setCurrentPage((page) => page - 1);
      }
    } catch (err) {
      console.error("Failed to delete recipe:", err);

      setError(
        err.message ||
          "Could not delete the recipe. Please try again."
      );
    }
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "public":
        return "bg-[#468432] text-white";

      case "pending":
        return "bg-[#FFA02E] text-black";

      case "ai_generated":
        return "bg-blue-600 text-white";

      case "deleted":
        return "bg-red-600 text-white";

      default:
        return "bg-gray-200 text-gray-700";
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown";
    }

    return status
      .replaceAll("_", " ")
      .replace(/\b\w/g, (letter) =>
        letter.toUpperCase()
      );
  };

  const formatDate = (date) => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString();
  };

  return (
    <>
      <AdminHeader />

      <div className="min-h-screen bg-gray-100 px-4 pb-10 pt-5 sm:px-10">
        <main className="mx-[25px] py-2">
          <h1 className="title-font text-3xl font-bold sm:text-4xl">
            Recipe Management
          </h1>

          <p className="mb-5 mt-3 text-gray-600">
            Manage and organize recipes for smarter
            cooking recommendations.
          </p>
        </main>

        {/* Summary cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {summaryCards.map((card) => (
            <div
              key={card.label}
              className="rounded-xl bg-white p-6 shadow"
            >
              <p className="text-lg font-semibold text-gray-600">
                {card.label}
              </p>

              <h2 className="mt-5 text-4xl font-bold text-gray-800">
                {card.value}
              </h2>
            </div>
          ))}
        </div>

        {error && (
          <div
            role="alert"
            className="mt-5 flex items-center justify-between gap-4 rounded-lg bg-red-100 p-4 text-red-700"
          >
            <p>{error}</p>

            <button
              type="button"
              onClick={loadRecipes}
              className="flex-shrink-0 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        <div className="mb-10 mt-5 overflow-x-auto rounded-xl bg-white shadow">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-2xl font-semibold">
              Recipe List
            </div>

            <div className="relative w-full lg:w-[450px]">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
                size={18}
              />

              <input
                type="search"
                value={input}
                onChange={(event) => {
                  setInput(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search recipe name or status..."
                className="w-full rounded-lg border bg-gray-100 px-4 py-3 pl-10 outline-none transition focus:border-[#468432] focus:ring-2 focus:ring-[#468432]/20"
              />
            </div>
          </div>

          <table className="w-full min-w-[750px] text-left">
            <thead className="bg-[#468432] text-white">
              <tr>
                <th className="p-4 pl-10">
                  Recipe Name
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Date
                </th>

                <th className="p-4">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-gray-500"
                  >
                    Loading recipes...
                  </td>
                </tr>
              ) : currentRecipes.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="p-10 text-center text-gray-500"
                  >
                    {input.trim()
                      ? "No recipes match your search."
                      : "No recipes found in the database."}
                  </td>
                </tr>
              ) : (
                currentRecipes.map((recipe) => (
                  <tr
                    key={recipe.id}
                    role="link"
                    tabIndex={0}
                    onClick={() =>
                      navigate(`/admin/view-recipe/${recipe.id}`)
                    }
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        navigate(`/admin/view-recipe/${recipe.id}`);
                      }
                    }}
                    className={
                      recipe.status === "deleted"
                        ? "cursor-pointer border-b bg-red-50 opacity-75"
                        : "cursor-pointer border-b transition hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    }
                  >
                    <td className="p-3 pl-10">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            recipe.image ||
                            RECIPE_PLACEHOLDER
                          }
                          alt={
                            recipe.title ||
                            recipe.name ||
                            "Recipe"
                          }
                          onError={
                            handleRecipeImageError
                          }
                          className="h-12 w-12 flex-shrink-0 rounded object-cover"
                        />

                        <span className="font-medium text-gray-800">
                          {recipe.title ||
                            recipe.name ||
                            "Untitled Recipe"}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <span
                        className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                          recipe.status
                        )}`}
                      >
                        {formatStatus(recipe.status)}
                      </span>
                    </td>

                    <td className="p-4 text-sm text-gray-500">
                      {formatDate(recipe.createdAt)}
                    </td>

                    <td className="p-4">
                      {recipe.status === "deleted" ? (
                        <span className="text-sm text-gray-400">
                          Deleted
                        </span>
                      ) : (
                        <div className="flex gap-4">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              navigate(
                                `/admin/edit/${recipe.id}`
                              );
                            }}
                            className="font-semibold text-[#468432] transition hover:text-[#1A5C05]"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              deleteRecipe(recipe.id);
                            }}
                            className="font-semibold text-red-600 transition hover:text-red-800"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex items-center justify-end gap-4 border-t p-4">
            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.max(1, page - 1)
                )
              }
              disabled={
                validCurrentPage === 1 ||
                loading
              }
              aria-label="Previous page"
              className="rounded border px-3 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              ←
            </button>

            <span className="text-sm text-gray-600">
              Page {validCurrentPage} of{" "}
              {totalPages || 1}
            </span>

            <button
              type="button"
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(totalPages, page + 1)
                )
              }
              disabled={
                validCurrentPage >= totalPages ||
                totalPages === 0 ||
                loading
              }
              aria-label="Next page"
              className="rounded border px-3 py-1 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        <button
          type="button"
          onClick={() =>
            navigate("/admin/create")
          }
          className="fixed bottom-6 right-6 rounded-full bg-[#468432] px-6 py-3 font-semibold text-white shadow-lg transition hover:bg-[#1A5C05]"
        >
          + Add New Recipe
        </button>
      </div>
    </>
  );
}
