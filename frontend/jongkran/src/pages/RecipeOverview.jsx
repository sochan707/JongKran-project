import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { recipeApi } from "../lib/api";
import {
  RECIPE_PLACEHOLDER,
  handleRecipeImageError,
} from "../lib/recipeImage";

const formatNutritionValue = (value, unit = "") => {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return "—";
  }

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "—";
  }

  const formattedValue = Number.isInteger(number)
    ? number
    : number.toFixed(1);

  return `${formattedValue}${unit}`;
};

export default function RecipeOverview() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadRecipe = async () => {
      try {
        setLoading(true);
        setError("");

        const recipeData = await recipeApi.get(id);

        if (isMounted) {
          setRecipe(recipeData);
        }
      } catch (requestError) {
        if (isMounted) {
          setError(
            requestError.message ||
              "Could not load this recipe."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadRecipe();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />

        <main className="flex min-h-[500px] items-center justify-center">
          <p className="text-xl font-semibold text-gray-700">
            Loading recipe...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (error || !recipe) {
    return (
      <>
        <Header />

        <main className="flex min-h-[500px] flex-col items-center justify-center px-6 text-center">
          <h1 className="text-3xl font-bold">
            Recipe not found
          </h1>

          <p className="mt-3 text-gray-600">
            {error || "This recipe is unavailable."}
          </p>

          <button
            type="button"
            onClick={() => navigate("/recipes")}
            className="mt-6 rounded-lg bg-[#468432] px-7 py-3 font-semibold text-white transition hover:bg-[#1A5C05]"
          >
            Back to Recipes
          </button>
        </main>

        <Footer />
      </>
    );
  }

  const recipeTitle =
    recipe.title || recipe.name || "Recipe";

  const totalTime =
    recipe.time ??
    Number(recipe.prep_time || 0) +
      Number(recipe.cook_time || 0);

  const nutritionItems = [
    {
      label: "Calories",
      value: formatNutritionValue(
        recipe.nutrition?.calories
      ),
    },
    {
      label: "Fat",
      value: formatNutritionValue(
        recipe.nutrition?.fat,
        "g"
      ),
    },
    {
      label: "Carbs",
      value: formatNutritionValue(
        recipe.nutrition?.carbs,
        "g"
      ),
    },
    {
      label: "Protein",
      value: formatNutritionValue(
        recipe.nutrition?.protein,
        "g"
      ),
    },
  ];

  const noNutrition = nutritionItems.every(
    (item) => item.value === "—"
  );

  return (
    <>
      <Header />

      <main className="min-h-screen bg-white">
        {/* HERO SECTION */}
        <section
          className="relative h-[300px] md:h-[360px] bg-cover bg-center"
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

            <h1 className="title-font text-4xl md:text-5xl font-bold">
              {recipe.name || recipe.title}
            </h1>

            <p className="mt-2">
              {recipe.time ||
                recipe.cookTime ||
                "Unknown"}{" "}
              min • {recipe.difficulty || "Easy"} •{" "}
              {recipe.servings || 1} servings
            </p>
          </div>
        </section>

        {/* DESCRIPTION AND NUTRITION */}
        <section className="px-[25px] py-8 md:py-10">
          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl bg-[#EAF3E7] p-5 shadow-sm md:p-7">
              {/* DESCRIPTION */}
              <section>
                <h2 className="title-font text-2xl font-bold text-gray-900 md:text-3xl">
                  Description
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-7 text-gray-700 md:text-base">
                  {recipe.description?.trim() ||
                    "No description is available for this recipe."}
                </p>
              </section>

              <div className="my-6 border-t border-[#BCD2B5]" />

              {/* NUTRITION */}
              <section>
                <div className="flex flex-wrap items-end gap-2">
                  <h2 className="title-font text-2xl font-bold text-gray-900 md:text-3xl">
                    Nutrition Facts
                  </h2>

                  <span className="pb-0.5 text-sm text-gray-600">
                    Per serving{recipe.nutrition?.estimated ? " · estimated" : ""}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-5 sm:grid-cols-4">
                  {nutritionItems.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-xl bg-white/60 p-3"
                    >
                      <p className="text-2xl font-bold text-gray-900 md:text-3xl">
                        {item.value}
                      </p>

                      <p className="mt-1 text-sm text-gray-600">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>

                {noNutrition && (
                  <p className="mt-4 text-sm text-gray-500">
                    Nutrition information has not been
                    provided for this recipe.
                  </p>
                )}

                {!noNutrition &&
                  recipe.nutrition?.calculatedIngredientCount <
                    recipe.nutrition?.ingredientCount && (
                    <p className="mt-4 text-sm text-gray-500">
                      Based on {recipe.nutrition.calculatedIngredientCount} of{" "}
                      {recipe.nutrition.ingredientCount} ingredients with available
                      nutrition data.
                    </p>
                  )}
              </section>
            </div>

            {/* START BUTTON */}
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() =>
                  navigate(
                    `/recipe/${recipe.id}/ingredients`
                  )
                }
                className="rounded-lg bg-[#468432] px-10 py-5 font-semibold text-white transition hover:bg-[#1A5C05] "
              >
                Start
              </button>
            </div>
          </div>
        </section>
      </main>


    </>
  );
}
