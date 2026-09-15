import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeGrid from "../components/recipes/RecipeGrid";
import { isAuthenticated, recipeApi } from "../lib/api";


export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const readLocalHistory = () => {
      try {
        const savedHistory = JSON.parse(
          localStorage.getItem("history") || "[]"
        );

        return Array.isArray(savedHistory) ? savedHistory : [];
      } catch {
        return [];
      }
    };

    const mergeHistory = (...historyLists) => {
      const recipesById = new Map();

      historyLists.flat().forEach((recipe) => {
        if (recipe?.id == null) return;

        const key = String(recipe.id);
        const existing = recipesById.get(key);
        const existingDate = new Date(existing?.completedAt || 0).getTime();
        const recipeDate = new Date(recipe.completedAt || 0).getTime();

        if (!existing || recipeDate >= existingDate) {
          recipesById.set(key, recipe);
        }
      });

      return [...recipesById.values()].sort(
        (left, right) =>
          new Date(right.completedAt || 0).getTime() -
          new Date(left.completedAt || 0).getTime()
      );
    };

    const localHistory = readLocalHistory();
    setHistory(localHistory);

    if (!isAuthenticated()) return;

    recipeApi.history()
      .then((serverHistory) =>
        setHistory(mergeHistory(serverHistory, localHistory))
      )
      .catch(() => setHistory(localHistory));
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

        {!isAuthenticated() && history.length === 0 && (
          <p className="mt-8">
            Complete a recipe to add it to your cooking history.
          </p>
        )}
        <RecipeGrid
          recipes={history}
          className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        />
      </main>

      <Footer />
    </>
  );
}
