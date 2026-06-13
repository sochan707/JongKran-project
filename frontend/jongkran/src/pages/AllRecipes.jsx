import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";

const recipes = [
  { id: 1, name: "Spaghetti", image: "https://images.unsplash.com/photo-1551892374-ecf8754cf8b0", time: 20, servings: 2 },
  { id: 2, name: "Cake", image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e", time: 40, servings: 4 },
  { id: 3, name: "Shaking Beef", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c", time: 25, servings: 3 },
  { id: 4, name: "French Fries", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877", time: 15, servings: 2 },
  { id: 5, name: "Beef Lok Lak", image: "https://images.unsplash.com/photo-1544025162-d76694265947", time: 20, servings: 4 },
  { id: 6, name: "Fish Amok", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38", time: 35, servings: 3 },
  { id: 7, name: "BBQ", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1", time: 30, servings: 2 },
  { id: 8, name: "Hoisin Garlic Noodles", image: "https://images.unsplash.com/photo-1552611052-33e04de081de", time: 20, servings: 2 },
];

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