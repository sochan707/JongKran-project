import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeGrid from "../components/recipes/RecipeGrid";
import { isAuthenticated } from "../services/session";
import { useFavorites } from "../features/recipes/context/FavoritesContext";

export default function Favorite() {
  const { favorites } = useFavorites();

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
          <RecipeGrid
            recipes={favorites}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
          />
        )}
      </main>

      <Footer />
    </>
  );
}
