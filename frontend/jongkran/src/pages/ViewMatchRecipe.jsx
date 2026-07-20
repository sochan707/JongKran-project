import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Utensils } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import RecipeCart from "../components/RecipeCart";
import AIRecipeCart from "../components/AIRecipeCart";
import { apiRequest, normalizeRecipe } from "../lib/api";
import { getRecipeMatchPercentage } from "../lib/recipeMatching";

export default function ViewMatchRecipe() {
  const navigate = useNavigate();

  const [aiRecipes, setAiRecipes] = useState([]);
  const [matchedRecipes, setMatchedRecipes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [sortByMatch, setSortByMatch] = useState(false);
  const [error, setError] = useState("");
  const [generationsRemaining, setGenerationsRemaining] = useState(null);

  const selectedIngredients =
    JSON.parse(
      localStorage.getItem("selectedIngredients")
    ) || [];

  useEffect(() => {
    if (selectedIngredients.length === 0) return;
    apiRequest("/recommendations", {
      method: "POST",
      body: JSON.stringify({ ingredients: selectedIngredients }),
    })
      .then((result) => {
        const items = result.recipes || [];
        setMatchedRecipes(items.map((item) => normalizeRecipe({
          ...item,
          ingredients: [...(item.matchedIngredients || []), ...(item.missingIngredients || [])],
        })));
      })
      .catch((err) => setError(err.message));
  }, []);

  // Combine normal recipes and AI recipes
  const displayedRecipes = [
    ...matchedRecipes,
    ...aiRecipes,
  ];

  // Sort highest match percentage first
  const sortedRecipes = sortByMatch
    ? [...displayedRecipes].sort(
        (firstRecipe, secondRecipe) =>
          getRecipeMatchPercentage(secondRecipe, selectedIngredients) -
          getRecipeMatchPercentage(firstRecipe, selectedIngredients)
      )
    : displayedRecipes;

  const generateAIRecipe = async () => {
    if (selectedIngredients.length === 0) {
      setError(
        "Please select at least one ingredient."
      );
      return;
    }

    try {
      setIsGenerating(true);
      setError("");

      const result = await apiRequest("/ai-recipes", {
        method: "POST",
        body: JSON.stringify({ ingredients: selectedIngredients }),
      });
      const generated = result.recipes || result.data?.recipes || result.data || [];
      const validRecipes = (Array.isArray(generated) ? generated : [generated])
        .filter(Boolean)
        .map(normalizeRecipe);
      setAiRecipes(validRecipes);
      setGenerationsRemaining(result.generationsRemaining ?? null);
      if (validRecipes.length === 0 && result.message) {
        setError(result.message);
      }
    } catch (error) {
      console.error(
        "AI recipe generation error:",
        error
      );

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
            ? `We found ${
                displayedRecipes.length
              } ${
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

        {error && (
          <p className="mt-4 font-medium text-red-500">{error}</p>
        )}

        {/* Sort button */}
        {displayedRecipes.length > 0 && (
          <div className="flex gap-4 mt-6">
            <button
              type="button"
              onClick={() =>
                setSortByMatch(
                  (currentValue) => !currentValue
                )
              }
              className={`border px-5 py-2 rounded-full transition ${
                sortByMatch
                  ? "bg-[#468432] border-[#468432] text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              {sortByMatch
                ? "Sorted By Match"
                : "Sort By Match"}
            </button>

          </div>
        )}

        {/* Recipe cards */}
        {displayedRecipes.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
            {sortedRecipes.map((recipe) =>
              recipe.ai_recipe_id ? (
                <AIRecipeCart
                  key={`ai-${recipe.id}`}
                  recipe={recipe}
                  selectedIngredients={selectedIngredients}
                />
              ) : (
                <RecipeCart
                  key={`recipe-${recipe.id}`}
                  recipe={recipe}
                  matched
                  selectedIngredients={selectedIngredients}
                />
              )
            )}
          </div>
        ) : (
          <div className="mt-10 w-full bg-[#E5F1E2] rounded-2xl p-8 md:p-10 text-center shadow-sm">
            <div className="w-16 h-16 mx-auto rounded-full bg-white flex items-center justify-center">
              {isGenerating ? (
                <div
                  role="img"
                  aria-label="Generating AI recipes"
                  className="h-16 w-16 overflow-hidden rounded-full"
                >
                  <DotLottieReact
                    src="/Cooking%20loader.lottie"
                    autoplay
                    loop
                    className="h-full w-full"
                  />
                </div>
              ) : (
                <Utensils
                  size={32}
                  className="text-[#468432]"
                />
              )}
            </div>

            <h2 className="title-font text-2xl font-bold mt-5">
              We couldn’t find a matching recipe
            </h2>

            <p className="text-gray-600 mt-3">
              Explore our available recipes or let AI
              create a recipe using your ingredients.
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-4 mt-7">
              <button
                type="button"
                onClick={() =>
                  navigate("/recipes")
                }
                className="flex-1 border-2 border-[#468432] text-[#468432] hover:bg-[#468432] hover:text-white px-6 py-3 rounded-md font-bold transition"
              >
                Explore Recipes
              </button>

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

        {aiRecipes.length > 0 && (
          <div className="mt-8 flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={generateAIRecipe}
              disabled={isGenerating || generationsRemaining === 0}
              className="flex items-center gap-2 rounded-md bg-[#468432] px-6 py-3 font-bold text-white transition hover:bg-[#1A5C05] disabled:cursor-not-allowed disabled:bg-gray-400"
            >
              <Sparkles size={20} />
              {isGenerating ? "Generating..." : "AI Generate"}
            </button>
            {generationsRemaining !== null && (
              <p className="text-sm text-gray-500">
                {generationsRemaining} of 5 generation requests remaining for the next 3 hours
              </p>
            )}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}
