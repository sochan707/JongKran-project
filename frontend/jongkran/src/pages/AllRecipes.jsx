import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import { Search } from "lucide-react";
import {useState} from "react";
import useRecipes from "../hooks/useRecipes";

export default function AllRecipes() {
  const [input, setInput] = useState("");
  const { recipes, loading, error } = useRecipes();

  const filteredRecipes = recipes.filter((r) => {
    const searchText = input.toLowerCase().trim();
    const title = (r.title || r.name || "").toLowerCase();

    return title.includes(searchText);
  });

  return (
    <>
      <Header />

      <main className="mx-[25px] py-6">
        <h1 className="title-font text-4xl md:text-4xl font-bold">
          Tailored For You
        </h1>

        <p className="mt-3 text-gray-600">
          Based on your recent interest in Mediterranean cuisine.
        </p>

          <div className="flex items-center mt-6 ">
            <div className="relative w-[450px]">
            <Search className="absolute left-4 top-4 text-black" size={18}/>
              <input
                type="text"
                value={input}
                onChange={(e) => {
                  setInput(e.target.value);
                }}

                placeholder="Search recipes name..."
                className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-1 focus:ring-[#468432]"
              />
            </div>
          </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {loading && <p>Loading recipes...</p>}
          {error && <p className="text-red-600">{error}</p>}
          {filteredRecipes.map((recipe) => (
            <RecipeCart key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
