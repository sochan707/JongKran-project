import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";

const favorites = [
  { id: 1, name: "Lok Lak", image: "https://images.unsplash.com/photo-1544025162-d76694265947", time: 20, servings: 4, favorite: true },
  { id: 2, name: "French Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877", time: 15, servings: 2, favorite: true },
  { id: 3, name: "Noodles", image: "https://images.unsplash.com/photo-1552611052-33e04de081de", time: 20, servings: 2, favorite: true },
];

export default function Favorite() {
  return (
    <>
      <Header />

      <main className="mx-[25px] py-12">
        <h1 className="title-font text-4xl md:text-6xl font-bold">
          Your Favorite Recipes
        </h1>

        <p className="mt-3 text-gray-600">
          All the recipes you have saved are in one place.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {favorites.map((recipe) => (
            <RecipeCart key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}