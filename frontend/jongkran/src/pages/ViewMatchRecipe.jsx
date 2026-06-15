import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import recipes from "../data/recipes";


export default function ViewMatchRecipe() {
  return (
    <>
      <Header />

      <main className="mx-[25px] py-12">
        <span className="inline-block bg-[#DDEED7] text-[#468432] px-5 py-2 rounded-full font-bold">
          Ingredients Matched
        </span>

        <h1 className="title-font text-4xl md:text-6xl font-bold mt-5">
          We found {recipes.length} recipes for you
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl">
          Using your selected ingredients, the following recipes are recommended
          as possible meal choices.
        </p>

        <div className="flex gap-4 mt-6">
          <button className="border px-5 py-2 rounded-full">Filters</button>
          <button className="border px-5 py-2 rounded-full">Sort By Match</button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {recipes.map((recipe) => (
            <RecipeCart key={recipe.id} recipe={recipe} matched />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}