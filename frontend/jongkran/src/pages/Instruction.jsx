import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "../components/Header";
import { apiRequest, recipeApi } from "../lib/api";

export default function Instruction() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [step, setStep] = useState(0);

  const [showCompleteModal, setShowCompleteModal] =
    useState(false);

  const [showSuggestionForm, setShowSuggestionForm] =
    useState(false);

  const [suggestion, setSuggestion] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    recipeApi.get(id)
      .then(setRecipe)
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  // ---------------- READ LOCAL STORAGE ----------------
  const getLocalStorageData = (key, fallbackValue) => {
    try {
      const savedData = localStorage.getItem(key);

      return savedData
        ? JSON.parse(savedData)
        : fallbackValue;
    } catch (error) {
      console.error(
        `Failed to read ${key} from localStorage:`,
        error
      );

      return fallbackValue;
    }
  };

  if (loading) {
    return <div className="p-10 text-2xl">Loading instructions...</div>;
  }

  if (loadError || !recipe) {
    return (
      <>
        <Header />

        <div className="min-h-[500px] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">
            {loadError || "Recipe not found"}
          </h1>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="mt-5 bg-[#468432] hover:bg-[#1A5C05] text-white px-6 py-3 rounded-md"
          >
            Back to Home
          </button>
        </div>
      </>
    );
  }

  const steps =
    recipe.steps && recipe.steps.length > 0
      ? recipe.steps
      : ["No cooking steps available."];

  // ---------------- COMPLETE COOKING ----------------
  const completeCooking = async () => {
    try {
      await recipeApi.addHistory(recipe.id);
    } catch (error) {
      console.error("Failed to save server history:", error);
    }
    const savedHistory = getLocalStorageData(
      "history",
      []
    );

    // Save only small recipe information.
    // Do not copy a large Base64 image into history.
    const completedRecipe = {
      id: recipe.id,
      name: recipe.name || recipe.title,
      title: recipe.title || recipe.name,

      image:
        typeof recipe.image === "string" &&
        !recipe.image.startsWith("data:image")
          ? recipe.image
          : "",

      time: recipe.time || recipe.cookTime || "",
      difficulty: recipe.difficulty || "Easy",
      servings: recipe.servings || 1,
      completedAt: new Date().toISOString(),
    };

    const alreadyExists = savedHistory.some(
      (item) =>
        String(item.id) === String(recipe.id)
    );

    const updatedHistory = alreadyExists
      ? savedHistory.map((item) =>
          String(item.id) === String(recipe.id)
            ? completedRecipe
            : item
        )
      : [...savedHistory, completedRecipe];

    try {
      localStorage.setItem(
        "history",
        JSON.stringify(updatedHistory)
      );
    } catch (error) {
      console.error(
        "Failed to save cooking history:",
        error
      );

      // Continue opening the popup even if history cannot save.
    }

    setShowCompleteModal(true);
  };

  // ---------------- POPUP ACTIONS ----------------
  const handleSkip = () => {
    setShowCompleteModal(false);
    navigate("/");
  };

  const handleOpenSuggestion = () => {
    setShowSuggestionForm(true);
  };

  const handleBackSuggestion = () => {
    setShowSuggestionForm(false);
  };

  // ---------------- SUBMIT SUGGESTION ----------------
  const handleSubmitSuggestion = async () => {
    const cleanSuggestion = suggestion.trim();

    if (!cleanSuggestion) {
      alert("Please write your suggestion.");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await apiRequest("/suggestions", {
        method: "POST",
        body: JSON.stringify({
          recipe_id: recipe.id,
          suggestion_text: cleanSuggestion,
        }),
      });
    } catch (error) {
      console.error("Failed to submit suggestion:", error);
      alert(error.message || "Failed to submit suggestion.");
      setIsSubmitting(false);
      return;
    }

    setSuggestion("");
    setShowSuggestionForm(false);
    setShowCompleteModal(false);
    setIsSubmitting(false);

    alert("Suggestion submitted successfully!");

    navigate("/");
  };

  return (
    <>
      <Header />

      <main>
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

        {/* CONTENT */}
        <section className="mx-[25px] py-8">
          {/* TABS */}
          <div className="flex border-b mb-8">
            <button
              type="button"
              onClick={() =>
                navigate(`/recipe/${recipe.id}`)
              }
              className="flex-1 py-4 font-bold"
            >
              Ingredients
            </button>

            <button
              type="button"
              className="flex-1 py-4 text-[#468432] border-b-2 border-[#468432] font-bold"
            >
              Instructions
            </button>
          </div>

          <div className="max-w-3xl mx-auto">
            {/* COOKING BOARD */}
            <div className="bg-[#E5F1E2] rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="title-font text-3xl font-bold text-center">
                Cooking Steps
              </h2>

              {/* PROGRESS BAR */}
              <div className="mt-8">
                <div className="flex justify-between text-sm mb-2">
                  <span>Step {step + 1}</span>

                  <span>
                    {step + 1}/{steps.length}
                  </span>
                </div>

                <div className="h-4 bg-gray-300 rounded-full">
                  <div
                    className="h-4 bg-[#468432] rounded-full transition-all duration-300"
                    style={{
                      width: `${
                        ((step + 1) / steps.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              {/* CURRENT STEP */}
              <div className="mt-8 bg-white rounded-xl p-6 h-[220px] overflow-y-auto">
                <h3 className="title-font text-2xl text-[#468432] font-bold">
                  Step {step + 1}
                </h3>

                <p className="mt-4 leading-8 text-gray-700">
                  {steps[step]}
                </p>
              </div>

              {/* NAVIGATION BUTTONS */}
              <div className="flex justify-between items-center gap-4 mt-8">
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStep(
                        (currentStep) =>
                          currentStep - 1
                      )
                    }
                    className="bg-[#468432] hover:bg-[#1A5C05] text-white px-4 md:px-8 py-3 rounded-md font-bold transition"
                  >
                    ← Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStep(
                        (currentStep) =>
                          currentStep + 1
                      )
                    }
                    className="bg-[#468432] hover:bg-[#1A5C05] text-white px-4 md:px-8 py-3 rounded-md font-bold transition"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={completeCooking}
                    className="bg-[#468432] hover:bg-[#1A5C05] text-white px-4 md:px-8 py-3 rounded-md font-bold transition"
                  >
                    Complete Cooking
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* COMPLETION POPUP */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 md:p-8">
            {!showSuggestionForm ? (
              <>
                <div className="flex flex-col items-center text-center">
                  <CheckCircle
                    size={70}
                    className="text-[#468432]"
                  />

                  <h2 className="title-font text-3xl font-bold mt-4">
                    Cooking Completed!
                  </h2>

                  <p className="text-gray-600 mt-3">
                    You have successfully completed
                    cooking{" "}
                    <span className="font-semibold text-black">
                      {recipe.name || recipe.title}
                    </span>
                    .
                  </p>

                  <p className="text-gray-500 mt-2">
                    Would you like to give us a
                    suggestion about this recipe?
                  </p>
                </div>

                <div className="flex justify-between gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleSkip}
                    className="flex-1 border border-gray-400 hover:bg-gray-100 px-5 py-3 rounded-md font-bold transition"
                  >
                    Skip
                  </button>

                  <button
                    type="button"
                    onClick={handleOpenSuggestion}
                    className="flex-1 bg-[#468432] hover:bg-[#1A5C05] text-white px-5 py-3 rounded-md font-bold transition"
                  >
                    Give Suggestion
                  </button>
                </div>
              </>
            ) : (
              <>
                <h2 className="title-font text-3xl font-bold text-center">
                  Your Suggestion
                </h2>

                <p className="text-gray-600 text-center mt-3">
                  Tell us what you think about{" "}
                  <span className="font-semibold">
                    {recipe.name || recipe.title}
                  </span>
                  .
                </p>

                <textarea
                  value={suggestion}
                  onChange={(event) =>
                    setSuggestion(event.target.value)
                  }
                  placeholder="Write your suggestion here..."
                  rows={6}
                  maxLength={500}
                  className="w-full mt-6 border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-1 focus:ring-[#468432]"
                />

                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>Maximum 500 characters</span>

                  <span>
                    {suggestion.length}/500
                  </span>
                </div>

                <div className="flex justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={handleBackSuggestion}
                    disabled={isSubmitting}
                    className="flex-1 border border-gray-400 hover:bg-gray-100 disabled:opacity-50 px-5 py-3 rounded-md font-bold transition"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={
                      !suggestion.trim() ||
                      isSubmitting
                    }
                    onClick={handleSubmitSuggestion}
                    className="flex-1 bg-[#468432] hover:bg-[#1A5C05] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-3 rounded-md font-bold transition"
                  >
                    {isSubmitting
                      ? "Submitting..."
                      : "Submit"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
