import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import { isAuthenticated, recipeApi } from "../lib/api";


export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    recipeApi.history().then(setHistory).catch(() => setHistory([]));
  }, []);

  return (
    <>
      <Header />

      <main className="mx-[25px] py-6">
        <h1 className="title-font text-4xl md:text-4xl font-bold">
          History Recipes
        </h1>

        <p className="mt-3 text-gray-600">
          Based on the recipes you recently explored and enjoyed.
        </p>

        {!isAuthenticated() && <p className="mt-8">Please log in to see your cooking history.</p>}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          {history.map((recipe) => (
            <RecipeCart key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}
