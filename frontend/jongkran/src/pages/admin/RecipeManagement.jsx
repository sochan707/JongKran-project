import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

export default function RecipeManagement() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recipes")) || [];
    setRecipes(data.filter(r => r.status !== "deleted"));
  }, []);

  const total = recipes.length;
  const pending = recipes.filter(r => r.status === "pending").length;
  const published = recipes.filter(r => r.status === "public").length;
  const ai_generated = recipes.filter(r => r.status === "ai_generated").length;

  const softDelete = (id) => {
    const data = JSON.parse(localStorage.getItem("recipes")) || [];

    const updated = data.map(r =>
      r.id === id ? { ...r, status: "deleted" } : r
    );

    localStorage.setItem("recipes", JSON.stringify(updated));
    setRecipes(updated.filter(r => r.status !== "deleted"));
  };

  return (
    <>
    <Header />
    <div className="p-8 bg-gray-50 min-h-screen sm:p-6 lg:p-8">

      <main className="mx-[25px] py-2">
        <h1 className="title-font text-3xl sm:text-4xl lg:text-6xl font-bold">
          Recipe Management
        </h1>

        <p className="mt-3 mb-10 text-gray-600">
            Manage and organize recipes for smarter cooking recommendations.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {recipes.map((recipe) => (
            <RecipeCart key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>

      {/* CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow min-h-[120px]">
            <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-semibold">
            Total Recipes
            </p>
            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">{total}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-semibold">
            Pending Recipes
          </p>
          <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">{pending}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-semibold">
            Published Recipes
          </p>
          <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">{published}</h2>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-lg sm:text-xl lg:text-2xl font-semibold">
              AI Generated Recipes
            </p>
            <h2 className="text-gray-800 text-3xl sm:text-5xl font-bold ml-3 mt-5">{ai_generated}</h2>
        </div>

      </div>

      {/* TABLE CARD */}
      <div className="bg-white rounded-xl shadow mt-10 overflow-x-auto">

        <div className="p-4 text-2xl border-b font-semibold text-center">
          Recipe List
        </div>

        <table className="min-w-[700px] w-full text-left">

          <thead className="bg-[#468432] text-white">
            <tr>
              <th className="p-4">Recipe</th>
              <th>Status</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {recipes.map(r => (
              <tr key={r.id} className="border-b hover:bg-gray-50">

                <td className="p-3 flex items-center gap-3">
                  <img src={r.image} className="w-12 h-12 rounded object-cover flex-shrink-0" />
                  <span>{r.title}</span>
                </td>

                <td>
                  <span className={`px-3 py-1 text-xs rounded-full text-white ${
                    r.status === "public" ? "bg-[#468432]" : "bg-[#FFA02E]"
                  }`}>
                    {r.status}
                  </span>
                </td>

                <td className="text-gray-500 text-sm">
                  {r.createdAt}
                </td>
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
      </div>

      {/* FLOAT BUTTON */}
      <button
        onClick={() => navigate("/admin/create")}
        className="
                    fixed
                    bottom-4
                    right-4
                    sm:bottom-6
                    sm:right-6
                    bg-[#468432]
                    text-white
                    px-4
                    sm:px-6
                    py-3
                    rounded-full
                    shadow-lg
                    hover:bg-[#3a6b2a]
                    text-sm
                    sm:text-base
                    "
      >
        + Add New Recipe
      </button>

    </div>
    </>
  );
}