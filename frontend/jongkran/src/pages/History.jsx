import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";

const history = [
  { id: 1, name: "Nom Banh Jok", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624", time: 25, servings: 2 },
  { id: 2, name: "French Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877", time: 15, servings: 2 },
  { id: 3, name: "Noodles", image: "https://images.unsplash.com/photo-1552611052-33e04de081de", time: 20, servings: 2 },
];

export default function History() {
  return (
    <>
      <Header />

      <main className="mx-[25px] py-12">
        <h1 className="title-font text-4xl md:text-6xl font-bold">
          History Recipes
        </h1>

        <p className="mt-3 text-gray-600">
          Based on the recipes you recently explored and enjoyed.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {history.map((recipe) => (
            <RecipeCart key={recipe.id} recipe={recipe} />
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
}