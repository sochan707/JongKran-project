import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import { isAuthenticated, recipeApi } from "../lib/api";

export default function Favorite() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    recipeApi.favorites().then(setFavorites).catch(() => setFavorites([]));
  }, []);

  return (
    <>
      <Header />

      <main className="mx-[25px] py-6 min-h-[60vh]">
        <h1 className="title-font text-4xl md:text-4xl font-bold">
          Your Favorite Recipes
        </h1>

        <p className="mt-3 text-gray-600">
          All the recipes you have saved are in one place.
        </p>

        {!isAuthenticated() ? (
          <div className="mt-12 text-center bg-gray-100 rounded-xl p-10">Please log in to see your favorite recipes.</div>
        ) : favorites.length === 0 ? (
          <div className="mt-12 text-center bg-gray-100 rounded-xl p-10">
            <h2 className="title-font text-2xl font-bold">
              No favorite recipes yet
            </h2>
            <p className="text-gray-500 mt-3">
              Click the heart icon on any recipe to save it here.
            </p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {favorites.map((recipe) => (
              <RecipeCart
                key={recipe.id}
                recipe={recipe}
                onFavoriteChange={setFavorites}
              />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
