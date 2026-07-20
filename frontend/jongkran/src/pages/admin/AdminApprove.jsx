import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest } from "../../lib/api";
import { RECIPE_PLACEHOLDER, handleRecipeImageError, } from "../../lib/recipeImage";

export default function AdminApprove() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [message, setMessage] = useState(null);
  const [showSortMenu, setShowSortMenu] = useState(false);
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });

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

  const statusRank = {
    pending: 0,
    approved: 1,
    rejected: 2,
  };

  const sortedRecipes = [...filteredRecipes].sort((first, second) => {
    let firstValue;
    let secondValue;

    if (sortConfig.key === "status") {
      firstValue = statusRank[first.status] ?? 3;
      secondValue = statusRank[second.status] ?? 3;
    } else if (sortConfig.key === "action") {
      firstValue = first.status === "pending" ? 0 : 1;
      secondValue = second.status === "pending" ? 0 : 1;
    } else {
      firstValue = new Date(first.createdAt).getTime() || 0;
      secondValue = new Date(second.createdAt).getTime() || 0;
    }

    const comparison = firstValue === secondValue
      ? first.id - second.id
      : firstValue - secondValue;

    return sortConfig.direction === "asc" ? comparison : -comparison;
  });

  const sortOptions = [
    { label: "Newest", key: "createdAt", direction: "desc" },
    { label: "Oldest", key: "createdAt", direction: "asc" },
    { label: "Pending", key: "status", direction: "asc" },
    { label: "Rejected", key: "status", direction: "desc" },
    { label: "Available", key: "action", direction: "asc" },
    { label: "Reviewed", key: "action", direction: "desc" },
  ];

  const activeSortOption = sortOptions.find(
    (option) =>
      option.key === sortConfig.key &&
      option.direction === sortConfig.direction
  ) || sortOptions[0];

  const selectSort = (option) => {
    setSortConfig({ key: option.key, direction: option.direction });
    setShowSortMenu(false);
    setCurrentPage(1);
  };

  const formatDateTime = (value) => {
    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "Unknown";

    return date.toLocaleString([], {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalPages = Math.ceil(
    sortedRecipes.length / recipesPerPage
  );

  const start = (currentPage - 1) * recipesPerPage;

  const currentRecipes = sortedRecipes.slice(
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
      setRecipes((current) =>
        current.map((recipe) =>
          recipe.id === id ? { ...recipe, status: "approved" } : recipe
        )
      );
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
      setRecipes((current) =>
        current.map((recipe) =>
          recipe.id === id ? { ...recipe, status: "rejected" } : recipe
        )
      );
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

          <div className="flex flex-col gap-4 border-b border-gray-100 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">

            <div className="text-2xl font-semibold">
              AI Recipe Reviews
            </div>

            <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-auto">
              <div className="relative w-full sm:w-[340px] lg:w-[360px]">
                <Search
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />

                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search recipe..."
                  aria-label="Search AI recipes"
                  className="h-12 w-full rounded-xl border border-gray-300 bg-white pl-11 pr-4 text-gray-800 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-[#468432] focus:ring-2 focus:ring-[#468432]/20"
                />
              </div>

              <div className="relative w-full sm:w-[190px] sm:flex-none">
                <button
                  type="button"
                  onClick={() => setShowSortMenu((current) => !current)}
                  aria-haspopup="menu"
                  aria-expanded={showSortMenu}
                  className="flex h-12 w-full items-center justify-between gap-3 rounded-xl border border-[#468432]/40 bg-[#F5FAF3] px-4 font-semibold text-[#356A27] outline-none transition hover:border-[#468432] hover:bg-[#EAF3E7] focus:ring-2 focus:ring-[#468432]/20"
                >
                  <span className="flex min-w-0 items-center gap-2 whitespace-nowrap">
                    <SlidersHorizontal size={18} className="shrink-0" />
                    Sort: {activeSortOption.label}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 transition ${showSortMenu ? "rotate-180" : ""}`}
                  />
                </button>

                {showSortMenu && (
                  <div
                    role="menu"
                    className="absolute right-0 z-30 mt-2 w-full overflow-hidden rounded-xl border border-gray-200 bg-white py-2 shadow-xl"
                  >
                    {sortOptions.map((option) => {
                      const isActive =
                        option.key === sortConfig.key &&
                        option.direction === sortConfig.direction;

                      return (
                        <button
                          key={`${option.key}-${option.direction}`}
                          type="button"
                          role="menuitemradio"
                          aria-checked={isActive}
                          onClick={() => selectSort(option)}
                          className={`flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left text-sm transition hover:bg-green-50 ${
                            isActive ? "font-semibold text-[#468432]" : "text-gray-700"
                          }`}
                        >
                          {option.label}
                          {isActive && <Check size={17} />}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

          </div>

          <table className="min-w-[700px] w-full">

            <thead className="bg-[#468432] text-white">
              <tr>
                <th className="p-4 pl-10 text-left">Recipe</th>
                <th className="px-4 py-4 text-left">Status</th>
                <th className="px-4 py-4 text-left">Date &amp; Time</th>
                <th className="px-4 py-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {!loading && currentRecipes.length === 0 && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    No AI recipes found.
                  </td>
                </tr>
              )}

              {loading && (
                <tr>
                  <td colSpan="4" className="p-8 text-center text-gray-500">
                    Loading AI recipes...
                  </td>
                </tr>
              )}

              {currentRecipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  role="link"
                  tabIndex={0}
                  onClick={() => navigate(`/admin/pending-approve/${recipe.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      navigate(`/admin/pending-approve/${recipe.id}`);
                    }
                  }}
                  className="cursor-pointer border-b hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
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
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                        recipe.status === "approved"
                          ? "bg-[#468432]"
                          : recipe.status === "rejected"
                            ? "bg-red-600"
                            : "bg-yellow-500"
                      }`}
                    >
                      {recipe.status === "approved"
                        ? "Approved"
                        : recipe.status === "rejected"
                          ? "Rejected"
                          : "Pending"}
                    </span>
                  </td>

                  <td className="px-4">
                    <time dateTime={recipe.createdAt}>
                      {formatDateTime(recipe.createdAt)}
                    </time>
                  </td>

                  <td className="px-4">
                    {recipe.status === "pending" ? (
                    <div className="flex gap-3">
                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          approveRecipe(recipe.id);
                        }}
                        disabled={processingId !== null}
                        className="text-[#468432] font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === recipe.id ? "Processing..." : "Publish"}
                      </button>

                      <button
                        onClick={(event) => {
                          event.stopPropagation();
                          rejectRecipe(recipe.id);
                        }}
                        disabled={processingId !== null}
                        className="text-red-600 font-semibold disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {processingId === recipe.id ? "Processing..." : "Reject"}
                      </button>
                    </div>
                    ) : (
                      <span className="text-sm font-medium text-gray-500">
                        Review complete
                      </span>
                    )}
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
