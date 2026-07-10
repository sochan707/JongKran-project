import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Utensils } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import recipes from "../data/recipes";

export default function ViewMatchRecipe() {
  const navigate = useNavigate();

  const [aiRecipes, setAiRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState("");

  const selectedIngredients =
    JSON.parse(localStorage.getItem("selectedIngredients")) || [];

  // Find recipes from the normal recipe data
  const matchedRecipes = recipes.filter((recipe) =>
    recipe.ingredients?.some((ingredient) =>
      selectedIngredients.some((input) => {
        const recipeIngredient = ingredient.toLowerCase();
        const selectedIngredient = input.toLowerCase();

        return (
          recipeIngredient.includes(selectedIngredient) ||
          selectedIngredient.includes(recipeIngredient)
        );
      })
    )
  );

  // Combine normal matched recipes and AI-generated recipes
  const displayedRecipes = [...matchedRecipes, ...aiRecipes];

  const generateAIRecipe = async () => {
    if (selectedIngredients.length === 0) {
      setError("Please select at least one ingredient.");
      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/recommendations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            ingredients: selectedIngredients,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message || "Unable to generate a recipe."
        );
      }

      /*
        This supports backend responses such as:

        {
          success: true,
          data: { recipe information }
        }

        or:

        {
          success: true,
          data: [{ recipe information }]
        }
      */

      const generatedRecipes = Array.isArray(result.data)
        ? result.data
        : [result.data];

      // Remove empty values
      const validRecipes = generatedRecipes.filter(Boolean);

      setAiRecipes(validRecipes);

      // Optional: save generated recipes temporarily
      localStorage.setItem(
        "aiGeneratedRecipes",
        JSON.stringify(validRecipes)
      );
    } catch (error) {
      console.error("AI recipe generation error:", error);

      setError(
        error.message ||
          "Something went wrong while generating the recipe."
      );
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <Header />

      <main className="mx-[25px] py-6 min-h-[600px]">
        <span className="inline-block bg-[#DDEED7] text-[#468432] px-5 py-2 rounded-full font-bold">
          Ingredients Matched
        </span>

        <h1 className="title-font text-4xl font-bold mt-5">
          {displayedRecipes.length > 0
            ? `We found ${displayedRecipes.length} ${
                displayedRecipes.length === 1
                  ? "recipe"
                  : "recipes"
              } for you`
            : "No matching recipe found"}
        </h1>

        <p className="mt-4 text-gray-600 max-w-2xl">
          {displayedRecipes.length > 0
            ? "Using your selected ingredients, the following recipes are recommended as possible meal choices."
            : "We could not find a recipe using your selected ingredients. You can explore all recipes or generate a new recipe using AI."}
        </p>

        {/* Show filters only when recipes exist */}
        {displayedRecipes.length > 0 && (
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              className="border px-5 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Filters
            </button>

            <button
              type="button"
              className="border px-5 py-2 rounded-full hover:bg-gray-100 transition"
            >
              Sort By Match
            </button>
          </div>
        )}

        {/* Recipe Cards */}
        {displayedRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {displayedRecipes.map((recipe) => (
              <RecipeCart
                key={recipe.id}
                recipe={recipe}
                matched
              />
            ))}
          </div>
        ) : (
          /* No Recipe Found Section */
          <div className="mt-10 max-[25px] bg-[#E5F1E2] rounded-2xl p-8 md:p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center">
              <Utensils
                size={32}
                className="text-[#468432]"
              />
            </div>

            <h2 className="title-font text-2xl font-bold mt-5">
              We couldn’t find a matching recipe
            </h2>

            <p className="text-gray-600 mt-3">
              Explore our available recipes or let AI create a
              recipe using your ingredients.
            </p>

            {error && (
              <p className="mt-4 text-red-500 font-medium">
                {error}
              </p>
            )}

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-7">
              {/* Explore Recipes Button */}
              <button
                type="button"
                onClick={() => navigate("/recipes")}
                className="flex-1 border-2 border-[#468432] text-[#468432] hover:bg-[#468432] hover:text-white px-6 py-3 rounded-md font-bold transition"
              >
                Explore Recipes
              </button>

              {/* AI Generate Button */}
              <button
                type="button"
                onClick={generateAIRecipe}
                disabled={isGenerating}
                className="flex-1 flex items-center justify-center gap-2 bg-[#468432] hover:bg-[#1A5C05] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 py-3 rounded-md font-bold transition"
              >
                <Sparkles size={20} />

                {isGenerating
                  ? "Generating..."
                  : "AI Generate"}
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}