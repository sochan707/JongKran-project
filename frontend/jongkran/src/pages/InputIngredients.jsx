import { useMemo, useState } from "react";
import {
  Search,
  ShoppingBasket,
  X,
} from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import recipes from "../data/recipes";

const commonIngredients = [
  {
    name: "Broccoli",
    image:
      "https://images.unsplash.com/photo-1615485290382-441e4d049cb5",
  },
  {
    name: "Rice",
    image:
      "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6",
  },
  {
    name: "Salmon",
    image:
      "https://images.unsplash.com/photo-1485921325833-c519f76c4927",
  },
  {
    name: "Carrot",
    image:
      "https://images.unsplash.com/photo-1447175008436-054170c2e979",
  },
  {
    name: "Egg",
    image:
      "https://images.unsplash.com/photo-1506976785307-8732e854ad03",
  },
  {
    name: "Cheese",
    image:
      "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d",
  },
];

export default function InputIngredients() {
  const navigate = useNavigate();

  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const [showSuggestions, setShowSuggestions] =
    useState(false);

  // Get every ingredient from recipes.jsx
  // and remove duplicate ingredient names
  const ingredientOptions = useMemo(() => {
    const allIngredients = recipes.flatMap(
      (recipe) => recipe.ingredients || []
    );

    return [...new Set(allIngredients)]
      .sort((a, b) => a.localeCompare(b));
  }, []);

  // Filter suggestions based on what user types
  const filteredSuggestions = ingredientOptions
    .filter((ingredient) =>
      ingredient
        .toLowerCase()
        .includes(input.trim().toLowerCase())
    )
    .filter(
      (ingredient) =>
        !ingredients.some(
          (selectedIngredient) =>
            selectedIngredient.toLowerCase() ===
            ingredient.toLowerCase()
        )
    )
    .slice(0, 8);

  // Make ingredient text look cleaner
  const formatIngredientName = (name) => {
    return name
      .split(" ")
      .map(
        (word) =>
          word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join(" ");
  };

  // Add ingredient
  const addIngredient = (name) => {
    const ingredientName = name.trim();

    if (!ingredientName) return;

    const alreadyAdded = ingredients.some(
      (ingredient) =>
        ingredient.toLowerCase() ===
        ingredientName.toLowerCase()
    );

    if (!alreadyAdded) {
      setIngredients([
        ...ingredients,
        formatIngredientName(ingredientName),
      ]);
    }

    setInput("");
    setShowSuggestions(false);
  };

  // Remove ingredient
  const removeIngredient = (name) => {
    setIngredients(
      ingredients.filter(
        (ingredient) => ingredient !== name
      )
    );
  };

  // Save ingredients and go to matched recipes page
  const handleFindRecipes = () => {
    if (ingredients.length === 0) return;

    localStorage.setItem(
      "selectedIngredients",
      JSON.stringify(ingredients)
    );

    navigate("/matched-recipes");
  };

  return (
    <>
      <Header />

      <main className="mx-[25px] py-6 lg:ml-10">
        <h1 className="title-font text-4xl font-bold">
          What’s in your Kitchen?
        </h1>

        <p className="mt-3 text-gray-600">
          Enter your ingredients and discover the
          perfect recipe.
        </p>

        <div className="grid gap-8 mt-10 lg:grid-cols-2">
          {/* COMMON INGREDIENTS */}
          <section className="border border-gray-300 rounded-xl p-6">
            {/* SEARCH INPUT */}
            <div className="relative mb-8">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-black"
                    size={18}
                  />

                  <input
                    type="text"
                    value={input}
                    onChange={(event) => {
                      setInput(event.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() =>
                      setShowSuggestions(true)
                    }
                    onKeyDown={(event) => {
                      if (
                        event.key === "Enter" &&
                        input.trim()
                      ) {
                        event.preventDefault();
                        addIngredient(input);
                      }

                      if (event.key === "Escape") {
                        setShowSuggestions(false);
                      }
                    }}
                    placeholder="Add ingredients (e.g. egg...)"
                    className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 pl-10 focus:outline-none focus:ring-1 focus:ring-[#468432]"
                  />

                  {/* INGREDIENT SUGGESTIONS */}
                  {showSuggestions &&
                    input.trim() &&
                    filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                        {filteredSuggestions.map(
                          (ingredient) => (
                            <button
                              key={ingredient}
                              type="button"
                              onMouseDown={(event) =>
                                event.preventDefault()
                              }
                              onClick={() =>
                                addIngredient(ingredient)
                              }
                              className="w-full text-left px-4 py-3 hover:bg-[#E5F1E2] border-b last:border-b-0"
                            >
                              {formatIngredientName(
                                ingredient
                              )}
                            </button>
                          )
                        )}
                      </div>
                    )}

                  {showSuggestions &&
                    input.trim() &&
                    filteredSuggestions.length === 0 && (
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-gray-300 rounded-lg shadow-lg z-20 px-4 py-3 text-gray-500">
                        No ingredient found. You can
                        still press Add.
                      </div>
                    )}
                </div>

                {/* ADD BUTTON */}
                <button
                  type="button"
                  onClick={() => addIngredient(input)}
                  disabled={!input.trim()}
                  className="bg-[#468432] hover:bg-[#1A5C05] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-6 rounded-lg font-semibold transition"
                >
                  Add
                </button>
              </div>
            </div>

            {/* INGREDIENT CARDS */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {commonIngredients.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() =>
                    addIngredient(item.name)
                  }
                  className="border rounded-xl overflow-hidden hover:shadow-md transition"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-36 w-full object-cover"
                  />

                  <p className="py-2 font-semibold">
                    {item.name}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* YOUR INGREDIENTS */}
          <section className="h-[560px] bg-[#E5F1E2] rounded-xl p-6 shadow flex flex-col">
            <h2 className="title-font text-2xl font-bold text-[#468432] shrink-0">
              Your Ingredients
            </h2>

            {/* SCROLLABLE INGREDIENT LIST */}
            <div className="flex-1 min-h-0 overflow-y-auto mt-5 pr-2">
              {ingredients.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                  <ShoppingBasket size={40} />

                  <p className="mt-3 text-center">
                    Add more to find perfect matches
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {ingredients.map((item) => (
                    <div
                      key={item}
                      className="bg-white rounded-md px-4 py-3 flex items-center justify-between"
                    >
                      <span className="font-medium">
                        {item}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          removeIngredient(item)
                        }
                        className="text-gray-500 hover:text-red-500 transition"
                        aria-label={`Remove ${item}`}
                      >
                        <X size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* FIND RECIPES BUTTON */}
            <button
              type="button"
              disabled={ingredients.length === 0}
              onClick={handleFindRecipes}
              className="shrink-0 w-full mt-5 bg-[#468432] hover:bg-[#1A5C05] disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-4 rounded-md font-bold transition"
            >
              Find Recipes →
            </button>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}