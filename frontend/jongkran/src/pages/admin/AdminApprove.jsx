import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import AdminHeader from "../../components/AdminHeader";

export default function AdminApprove() {
  const [recipes, setRecipes] = useState([]);
  const [search, setSearch] = useState("");

  const recipesPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const pending =
      JSON.parse(localStorage.getItem("pendingRecipes")) || [];

    setRecipes(pending);
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

  const approveRecipe = (id) => {
    const pending =
      JSON.parse(localStorage.getItem("pendingRecipes")) || [];

    const approved =
      JSON.parse(localStorage.getItem("recipes")) || [];

    const recipe = pending.find((r) => r.id === id);

    if (!recipe) return;

    recipe.status = "public";

    approved.push(recipe);

    localStorage.setItem("recipes", JSON.stringify(approved));

    const updatedPending = pending.filter((r) => r.id !== id);

    localStorage.setItem(
      "pendingRecipes",
      JSON.stringify(updatedPending)
    );

    setRecipes(updatedPending);
  };

  const rejectRecipe = (id) => {
    const updated = recipes.filter((r) => r.id !== id);

    localStorage.setItem(
      "pendingRecipes",
      JSON.stringify(updated)
    );

    setRecipes(updated);
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
            Review AI-generated recipes submitted by users.
          </p>
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
              {currentRecipes.map((recipe) => (
                <tr
                  key={recipe.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="p-3 pl-10 flex items-center gap-3">
                    <img
                      src={recipe.image}
                      alt={recipe.title}
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
                        className="text-[#468432] font-semibold"
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => rejectRecipe(recipe.id)}
                        className="text-red-600 font-semibold"
                      >
                        Reject
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