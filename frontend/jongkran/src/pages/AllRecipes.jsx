import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import recipes from "../data/recipes";


export default function AllRecipes() {
  return (
    <>
      <Header />

      <main className="mx-[25px] py-12">
        <h1 className="title-font text-4xl md:text-6xl font-bold">
          Tailored For You
        </h1>

        <p className="mt-3 text-gray-600">
          Based on your recent interest in Mediterranean cuisine.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
          {recipes.map((recipe) => (
            <RecipeCart key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}