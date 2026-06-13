import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";

const recipes = [
  { id: 1, name: "Beef Lok Lak", image: "https://images.unsplash.com/photo-1544025162-d76694265947", time: 20, servings: 4 },
  { id: 2, name: "Shaking Beef", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", time: 25, servings: 3 },
  { id: 3, name: "BBQ", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", time: 30, servings: 2 },
  { id: 4, name: "Corned Beef", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", time: 25, servings: 2 },
];

export default function ViewMatchRecipe() {
  return (
    <>
      <Header />

      <main className="mx-[25px] py-12">
        <span className="inline-block bg-[#DDEED7] text-[#468432] px-5 py-2 rounded-full font-bold">
          Ingredients Matched
        </span>

        <h1 className="title-font text-4xl md:text-6xl font-bold mt-5">
          We found 4 recipes for you
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