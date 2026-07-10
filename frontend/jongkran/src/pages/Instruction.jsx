import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import Header from "../components/Header";
import recipes from "../data/recipes";

export default function Instruction() {
  const [step, setStep] = useState(0);

  // Completion popup
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  // Suggestion form inside the popup
  const [showSuggestionForm, setShowSuggestionForm] = useState(false);
  const [suggestion, setSuggestion] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  const recipe = recipes.find(
    (item) => item.id === Number(id)
  );

  if (!recipe) {
    return (
      <>
        <Header />

        <div className="min-h-[500px] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold">
            Recipe not found
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

  const steps = recipe.steps;

  // Save completed recipe to history
  const completeCooking = () => {
    const savedHistory =
      JSON.parse(localStorage.getItem("history")) || [];

    const completedRecipe = {
      ...recipe,
      completedAt: new Date().toISOString(),
    };

    const alreadyExists = savedHistory.some(
      (item) => item.id === recipe.id
    );

    let updatedHistory;

    if (alreadyExists) {
      // Update the completed time instead of adding a duplicate
      updatedHistory = savedHistory.map((item) =>
        item.id === recipe.id
          ? completedRecipe
          : item
      );
    } else {
      updatedHistory = [
        ...savedHistory,
        completedRecipe,
      ];
    }

    localStorage.setItem(
      "history",
      JSON.stringify(updatedHistory)
    );

    // Show completion popup
    setShowCompleteModal(true);
  };

  // Skip suggestion and return home
  const handleSkip = () => {
    navigate("/");
  };

  // Open suggestion form
  const handleOpenSuggestion = () => {
    setShowSuggestionForm(true);
  };

  // Save suggestion to localStorage
  const handleSubmitSuggestion = () => {
    const cleanSuggestion = suggestion.trim();

    if (!cleanSuggestion) {
      return;
    }

    // Pull the logged-in user's name from their account
    const currentUser = JSON.parse(localStorage.getItem("user")) || {};
    const userName = currentUser.name;

    const savedSuggestions =
      JSON.parse(localStorage.getItem("suggestions")) || [];

    const newSuggestion = {
      id: Date.now(),
      recipeId: recipe.id,
      recipeName: recipe.name,
      userName: currentUser.name,
      message: cleanSuggestion,
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(
      "suggestions",
      JSON.stringify([
        ...savedSuggestions,
        newSuggestion,
      ])
    );

    navigate("/");
  };

  return (
    <>
      <Header />

      <main>
        {/* Hero Section */}
        <section
          className="relative h-[30px] md:h-[360px] bg-cover bg-center"
          style={{
            backgroundImage: `url(${recipe.image})`,
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

        {/* Content */}
        <section className="mx-[25px] py-8">
          {/* Tabs */}
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
            {/* Cooking Board */}
            <div className="bg-[#E5F1E2] rounded-xl p-6 md:p-8 shadow-sm">
              <h2 className="title-font text-3xl font-bold text-center">
                Cooking Steps
              </h2>

              {/* Progress Bar */}
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

              {/* Current Step */}
              <div className="mt-8 bg-white rounded-xl p-6 h-[220px] overflow-y-auto">
                <h3 className="title-font text-2xl text-[#468432] font-bold">
                  Step {step + 1}
                </h3>

                <p className="mt-4 leading-8 text-gray-700">
                  {steps[step]}
                </p>
              </div>

              {/* Navigation Buttons */}
              <div className="flex justify-between items-center gap-4 mt-8">
                {/* Previous Button */}
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStep((currentStep) => currentStep - 1)
                    }
                    className="bg-[#468432] hover:bg-[#1A5C05] text-white px-4 md:px-8 py-3 rounded-md font-bold transition"
                  >
                    ← Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {/* Next or Complete Button */}
                {step < steps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() =>
                      setStep((currentStep) => currentStep + 1)
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

      {/* Completion Popup */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-5">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6 md:p-8">
            {!showSuggestionForm ? (
              <>
                {/* Completion Message */}
                <div className="flex flex-col items-center text-center">
                  <CheckCircle
                    size={70}
                    className="text-[#468432]"
                  />

                  <h2 className="title-font text-3xl font-bold mt-4">
                    Cooking Completed!
                  </h2>

                  <p className="text-gray-600 mt-3">
                    You have successfully completed cooking{" "}
                    <span className="font-semibold text-black">
                      {recipe.name}
                    </span>
                    .
                  </p>

                  <p className="text-gray-500 mt-2">
                    Would you like to give us a suggestion
                    about this recipe?
                  </p>
                </div>

                {/* Skip and Suggestion Buttons */}
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
                {/* Suggestion Form */}
                <h2 className="title-font text-3xl font-bold text-center">
                  Your Suggestion
                </h2>

                <p className="text-gray-600 text-center mt-3">
                  Tell us what you think about{" "}
                  <span className="font-semibold">
                    {recipe.name}
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
                  className="w-full mt-6 border border-gray-300 rounded-lg p-4 resize-none focus:outline-none focus:ring-1 focus:ring-[#468432]"
                />

                {/* Suggestion Form Buttons */}
                <div className="flex justify-between gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() =>
                      setShowSuggestionForm(false)
                    }
                    className="flex-1 border border-gray-400 hover:bg-gray-100 px-5 py-3 rounded-md font-bold transition"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={!suggestion.trim()}
                    onClick={handleSubmitSuggestion}
                    className="flex-1 bg-[#468432] hover:bg-[#1A5C05] disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-5 py-3 rounded-md font-bold transition"
                  >
                    Submit
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