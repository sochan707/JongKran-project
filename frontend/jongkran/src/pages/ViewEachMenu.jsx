import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { recipeApi } from "../lib/api";

export default function ViewEachMenu() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [yourIngredients, setYourIngredients] = useState([]);
  const [missingIngredients, setMissingIngredients] = useState([]);

  useEffect(() => {
    recipeApi.get(id)
      .then((recipeData) => {
        if (recipeData.cookingDetailsAvailable === false) {
          navigate("/login", {
            replace: true,
            state: {
              message: "Please log in first to view recipe ingredients.",
              returnTo: `/recipe/${id}/ingredients`,
            },
          });
          return;
        }

        setRecipe(recipeData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  useEffect(() => {
    if (!recipe) return;

    const userIngredients =
      JSON.parse(localStorage.getItem("selectedIngredients")) || [];

    const isMatched = (recipeIngredient) =>
      userIngredients.some(
        (userIngredient) =>
          recipeIngredient.toLowerCase().includes(userIngredient.toLowerCase()) ||
          userIngredient.toLowerCase().includes(recipeIngredient.toLowerCase())
      );

    const your = recipe.ingredients.filter((ingredient) =>
      isMatched(ingredient)
    );

    const missing = recipe.ingredients.filter(
      (ingredient) => !isMatched(ingredient)
    );

    setYourIngredients(your);
    setMissingIngredients(missing);
  }, [recipe]);

  if (loading) return <h1 className="p-10 text-2xl">Loading recipe...</h1>;
  if (error || !recipe) {
    return <h1 className="p-10 text-3xl font-bold">{error || "Recipe not found"}</h1>;
  }

  const addMissing = (item) => {
    setYourIngredients([...yourIngredients, item]);
    setMissingIngredients(missingIngredients.filter((i) => i !== item));
  };

  const removeYourIngredient = (item) => {
    setMissingIngredients([...missingIngredients, item]);
    setYourIngredients(yourIngredients.filter((i) => i !== item));
  };

  return (
    <>
      <Header />

      <main>
        <section
          className="relative h-[360px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${
              recipe.image ||
              "https://madeinindiarestaurant.com/img/placeholders/comfort_food_placeholder.png"
            })`,
          }}
        >
          <div className="absolute inset-0 bg-black/35" />

          <div className="absolute bottom-8 left-[25px] text-white">
            <div className="flex gap-3 mb-3">
              <span className="bg-orange-400 px-4 py-1 rounded-full text-sm">
                Smart Choice
              </span>
              <span className="bg-[#468432] px-4 py-1 rounded-full text-sm">
                Healthy
              </span>
            </div>

            <h1 className="title-font text-4xl md:text-5xl font-bold">{recipe.name}</h1>
            <p className="mt-2">
              {recipe.time} min • {recipe.difficulty || "Easy"} •{" "}
              {recipe.servings} servings
            </p>
          </div>
        </section>

        <section className="mx-[25px] py-8">
          <div className="flex border-b mb-8">
            <button className="flex-1 py-4 text-[#468432] border-b-2 border-[#468432] font-bold">
              Ingredients
            </button>

            <button
              onClick={() => navigate(`/instruction/${recipe.id}`)}
              className="flex-1 py-4 font-bold"
            >
              Instructions
            </button>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="bg-[#E5F1E2] rounded-xl p-6">
              <span className="bg-[#468432] text-white px-5 py-2 rounded-full text-sm">
                Your Ingredients
              </span>

              <div className="mt-5 divide-y divide-gray-300">
                {yourIngredients.map((item) => (
                  <div key={item} className="flex justify-between py-4">
                    <span>{item}</span>
                    <button onClick={() => removeYourIngredient(item)}>
                      <Trash2 className="text-red-500" size={20} />
                    </button>
                  </div>
                ))}
              </div>

              <span className="inline-block mt-8 bg-orange-400 text-white px-5 py-2 rounded-full text-sm">
                Missing Ingredients
              </span>

              <div className="mt-5 divide-y divide-gray-300">
                {missingIngredients.map((item) => (
                  <div key={item} className="flex justify-between py-4">
                    <span>{item}</span>
                    <button onClick={() => addMissing(item)}>
                      <Plus className="text-green-600" size={24} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => navigate(`/instruction/${recipe.id}`)}
                className="bg-[#468432] hover:bg-[#1A5C05] text-white px-10 py-4 rounded-lg font-bold"
              >
                Start Cooking
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
