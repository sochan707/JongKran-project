import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import recipeData from "../../data/recipes";
import { Search } from "lucide-react";

export default function RecipeManagement() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [input, setInput] = useState("");

  const recipesPerPage = 10;

  useEffect(() => {
    const localRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const formattedRecipes = recipeData.map((r) => ({
      ...r,
      title: r.name,
      status: r.status || "public",
      createdAt: r.createdAt || "2026-07-06",
    }));

    const allRecipes = [...formattedRecipes, ...localRecipes];

    setRecipes(allRecipes.filter((r) => r.status !== "deleted"));
  }, []);

  const filteredRecipes = recipes.filter((r) => {
    const searchText = input.toLowerCase().trim();
    const title = r.title.toLowerCase();
    const status = r.status.toLowerCase();

    return title.includes(searchText) || status.includes(searchText);
  });

  const total = recipes.length;
  const pending = recipes.filter((r) => r.status === "pending").length;
  const published = recipes.filter((r) => r.status === "public").length;
  const ai_generated = recipes.filter(
    (r) => r.status === "ai_generated"
  ).length;

  const totalPages = Math.ceil(recipes.length / recipesPerPage);
  const startIndex = (currentPage - 1) * recipesPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, startIndex + recipesPerPage);

  const goPrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const softDelete = (id) => {
    const updated = recipes.map((r) =>
      r.id === id ? { ...r, status: "deleted" } : r
    );

    setRecipes(updated.filter((r) => r.status !== "deleted"));

    if (currentRecipes.length === 1 && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="bg-gray-100 min-h-screen pl-10 pr-10 rounded-xl pt-5 pb-10">
        <main className="mx-[25px] py-2">
          <h1 className="title-font text-3xl sm:text-4xl lg:text-5xl font-bold">
            Recipe Management
          </h1>

          <p className="mt-3 mb-5 text-gray-600">
            Manage and organize recipes for smarter cooking recommendations.
          </p>
        </main>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl lg:text-xl font-semibold">
              Total Recipes
            </p>
            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {total}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl lg:text-xl font-semibold">
              Pending Recipes
            </p>
            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {pending}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl lg:text-xl font-semibold">
              Published Recipes
            </p>
            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {published}
            </h2>
          </div>

          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl lg:text-xl font-semibold">
              AI Generated Recipes
            </p>
            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">
              {ai_generated}
            </h2>
          </div>

        </div>

        <div className="bg-white rounded-xl shadow mt-5 overflow-x-auto mb-10">
          <div className="grid lg:grid-cols-2 gap-8 mt-2">
            <div className="p-4 text-2xl border-b font-semibold pl-10 items-center">
              Recipe List
            </div>
            
            <div className="flex justify-end items-center pr-10">
              <div className="relative w-[450px]">
              <Search className="absolute left-4 top-4 text-black" size={18}/>
              <input
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                  setCurrentPage(1);
                }}

                placeholder="Search recipes name or status..."
                className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-1 focus:ring-[#468432]"
              />
              </div>
            </div>
        </div>

          <table className="min-w-[700px] w-full text-left">
            <thead className="bg-[#468432] text-white">
              <tr>
                <th className="p-4 pl-10">Recipe Name</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {currentRecipes.map((r) => (
                <tr key={r.id} className="border-b hover:bg-gray-50">
                  <td className="p-3 flex items-center gap-3 pl-10">
                    <img
                      src={r.image}
                      alt={r.title}
                      className="w-12 h-12 rounded object-cover flex-shrink-0"
                    />
                    <span>{r.title}</span>
                  </td>

                  <td>
                    <span
                      className={`px-3 py-1 text-xs rounded-full text-white ${
                        r.status === "public"
                          ? "bg-[#468432]"
                          : "bg-[#FFA02E]"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>

                  <td className="text-gray-500 text-sm">{r.createdAt}</td>

                  <td className="p-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => navigate(`/admin/edit/${r.id}`)}
                        className="text-[#468432] font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => softDelete(r.id)}
                        className="text-red-600 font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-end gap-4 p-4">
            <button
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
              onClick={goNext}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 rounded border disabled:opacity-40"
            >
              →
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate("/admin/create")}
          className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 bg-[#468432] text-white px-4 sm:px-6 py-3 rounded-full shadow-lg hover:bg-[#3a6b2a] text-sm sm:text-base"
        >
          + Add New Recipe
        </button>
      </div>
    </>
  );
}