import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest, normalizeRecipe } from "../../lib/api";
import { RECIPE_PLACEHOLDER, handleRecipeImageError, } from "../../lib/recipeImage";

export default function UserSuggestions() {
  const navigate = useNavigate();

  const [recipes, setRecipes] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState("");
  const [sortBy, setSortBy] = useState("suggestionCount");

  const recipesPerPage = 10;

  useEffect(() => {
    Promise.all([apiRequest("/recipes"), apiRequest("/suggestions")])
      .then(([recipeResult, suggestionResult]) => {
        setRecipes(recipeResult.data.map((recipe) => ({ ...normalizeRecipe(recipe), status: "public", createdAt: recipe.created_at })));
        setSuggestions(suggestionResult.data.map((suggestion) => ({
          ...suggestion,
          id: suggestion.suggestion_id,
          recipeId: suggestion.recipe_id,
          createdAt: suggestion.created_at,
        })));
      })
      .catch((error) => console.error("Failed to load database suggestions:", error));
  }, []);

  const recipesWithSuggestionData = recipes.map((recipe) => {
    const recipeSuggestions = suggestions.filter(
      (suggestion) =>
        String(suggestion.recipeId) === String(recipe.id)
    );

    const latestSuggestionDate = recipeSuggestions.reduce(
      (latestDate, suggestion) => {
        if (!latestDate) {
          return suggestion.createdAt;
        }

        return new Date(suggestion.createdAt) >
          new Date(latestDate)
          ? suggestion.createdAt
          : latestDate;
      },
      null
    );

    return {
      ...recipe,
      suggestionCount: recipeSuggestions.length,
      latestSuggestionDate,
    };
  });

  const filteredRecipes = recipesWithSuggestionData.filter(
    (recipe) => {
      const searchText = input.toLowerCase().trim();
      const title = (recipe.title || "").toLowerCase();
      const status = (recipe.status || "").toLowerCase();

      return (
        title.includes(searchText) ||
        status.includes(searchText)
      );
    }
  );

  const sortedRecipes = [...filteredRecipes].sort((recipeA, recipeB) => {
    const countDifference =
      recipeB.suggestionCount - recipeA.suggestionCount;
    const dateA = recipeA.latestSuggestionDate
      ? new Date(recipeA.latestSuggestionDate).getTime()
      : 0;
    const dateB = recipeB.latestSuggestionDate
      ? new Date(recipeB.latestSuggestionDate).getTime()
      : 0;
    const dateDifference = dateB - dateA;

    if (sortBy === "newestSuggestion") {
      return (
        dateDifference ||
        countDifference ||
        String(recipeA.title || "").localeCompare(String(recipeB.title || ""))
      );
    }

    return (
      countDifference ||
      dateDifference ||
      String(recipeA.title || "").localeCompare(String(recipeB.title || ""))
    );
  });

  const totalRecipes = recipes.length;
  const totalSuggestions = suggestions.length;

  const recipesWithSuggestions =
    recipesWithSuggestionData.filter(
      (recipe) => recipe.suggestionCount > 0
    ).length;

  const totalPages = Math.ceil(
    sortedRecipes.length / recipesPerPage
  );

  const startIndex =
    (currentPage - 1) * recipesPerPage;

  const currentRecipes = sortedRecipes.slice(
    startIndex,
    startIndex + recipesPerPage
  );

  const formatDate = (dateString) => {
    if (!dateString) {
      return "No suggestions yet";
    }

    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Unknown date";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const openRecipeSuggestions = (recipeId) => {
    navigate(`/admin/suggestions/${recipeId}`);
  };

  const goPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage((page) => page - 1);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage((page) => page + 1);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="bg-gray-100 min-h-screen px-4 sm:px-10 pt-5 pb-10">
        <main className="mx-[25px] py-2">
          <h1 className="title-font text-3xl sm:text-4xl lg:text-5xl font-bold">
            User Suggestions
          </h1>

          <p className="mt-3 mb-5 text-gray-600">
            Select a recipe to view suggestions submitted by users.
          </p>
        </main>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl font-semibold">
              Total Recipes
            </p>

            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {totalRecipes}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl font-semibold">
              Total Suggestions
            </p>

            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {totalSuggestions}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl font-semibold">
              Recipes With Suggestions
            </p>

            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {recipesWithSuggestions}
            </h2>
          </div>
        </div>

        {/* Recipe table */}
        <div className="bg-white rounded-xl shadow mt-5 mb-10 overflow-hidden">
          <div className="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="text-2xl font-semibold pl-2 sm:pl-6 flex items-center">
              Recipe List
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <label className="flex items-center gap-2 whitespace-nowrap font-medium text-gray-700">
                Sort by
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="rounded-lg border border-gray-300 bg-white px-3 py-3 outline-none focus:border-[#468432] focus:ring-1 focus:ring-[#468432]"
                >
                  <option value="suggestionCount">Most suggestions</option>
                  <option value="newestSuggestion">Newest suggestion</option>
                </select>
              </label>

              <div className="relative w-full sm:w-[350px] lg:w-[450px]">
                <Search
                  className="absolute left-4 top-4 text-black"
                  size={18}
                />

                <input
                  value={input}
                  onChange={(event) => {
                    setInput(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search recipe name or status..."
                  className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-1 focus:ring-[#468432]"
                />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full text-left">
              <thead className="bg-[#468432] text-white">
                <tr>
                  <th className="p-4 pl-10">
                    Recipe Name
                  </th>

                  <th className="p-4">
                    Status
                  </th>

                  <th className="p-4">
                    Suggestions
                  </th>

                  <th className="p-4">
                    Latest Suggestion
                  </th>

                  <th className="p-4">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {currentRecipes.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-12 text-gray-500"
                    >
                      No recipes found.
                    </td>
                  </tr>
                ) : (
                  currentRecipes.map((recipe) => (
                    <tr
                      key={recipe.id}
                      onClick={() =>
                        openRecipeSuggestions(recipe.id)
                      }
                      className="border-b hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="p-3 pl-10">
                        <div className="flex items-center gap-3">
                          <img
                            src={recipe.image || RECIPE_PLACEHOLDER}
                            alt={recipe.title || "Recipe"}
                            onError={handleRecipeImageError}
                            className="w-12 h-12 rounded-md object-cover flex-shrink-0"
                          />

                          <span className="font-medium">
                            {recipe.title}
                          </span>
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 text-xs rounded-full text-white ${
                            recipe.status === "public"
                              ? "bg-[#468432]"
                              : "bg-[#FFA02E]"
                          }`}
                        >
                          {recipe.status}
                        </span>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            recipe.suggestionCount > 0
                              ? "bg-green-100 text-[#468432]"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          {recipe.suggestionCount}
                        </span>
                      </td>

                      <td className="p-3 text-gray-500 text-sm">
                        {formatDate(
                          recipe.latestSuggestionDate
                        )}
                      </td>

                      <td className="p-3">
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();

                            openRecipeSuggestions(
                              recipe.id
                            );
                          }}
                          className="text-[#468432] font-semibold hover:underline"
                        >
                          View Suggestions
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-end gap-4 p-4">
            <button
              type="button"
              onClick={goPrevious}
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
              onClick={goNext}
              disabled={
                totalPages === 0 ||
                currentPage >= totalPages
              }
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
