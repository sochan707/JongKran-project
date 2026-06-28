import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import recipes from "../data/recipes";


export default function Instruction() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();

  const recipe = recipes.find(
  (item) => item.id === Number(id)
  );

  if (!recipe) {
  return <h1>Recipe not found</h1>;
  }
  const steps = recipe.steps;

  const completeCooking = () => {
    const savedHistory =
      JSON.parse(localStorage.getItem("history")) || [];

    const alreadyExists = savedHistory.some(
      (item) => item.id === recipe.id
    );

    localStorage.setItem(
      "history",
      JSON.stringify([
        ...savedHistory,
        {
          ...recipe,
          completedAt: new Date().toISOString(),
        },
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
          className="relative h-[300px] md:h-[420px] bg-cover bg-center"
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

            <h1 className="title-font text-4xl md:text-6xl font-bold">
              {recipe.name}
            </h1>

            <div className="flex gap-4 mt-3 text-sm md:test-base">
              <span>{recipe.time} min</span>
              <span>{recipe.difficulty}</span>
              <span>{recipe.servings} servings</span>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="mx-[25px] py-8">

            {/* Tabs */}
            <div className="flex border-b mb-8">
              <button
                onClick={() => navigate(`/recipe/${recipe.id}`)}
                className="flex-1 py-4 font-bold"
              >
                Ingredients
              </button>

              <button className="flex-1 py-4 text-[#468432] border-b-2 border-[#468432] font-bold">
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
              <div className="mt-8 bg-white rounded-xl p-6">
                <h3 className="title-font text-2xl text-[#468432] font-bold">
                  Step {step + 1}
                </h3>

                <p className="mt-4 leading-8 text-gray-700">
                  {steps[step]}
                </p>
              </div>


              {/* Buttons */}
              <div className="flex justify-between mt-8">
                {/* Previous Button */}
                {step > 0 ? (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="bg-[#468432] hover:bg-[#1A5C05] text-white px-8 py-3 rounded-md font-bold transition"
                  >
                    ← Previous Step
                  </button>
                ) : (
                  <div />
                )}

                {/* Next / Complete Button */}
                {step < steps.length - 1 ? (
                  <button
                    onClick={() => setStep(step + 1)}
                    className="bg-[#468432] hover:bg-[#1A5C05] text-white px-8 py-3 rounded-md font-bold transition"
                  >
                    Next Step →
                  </button>
                ) : (
                  <button
                    onClick={completeCooking}
                    className="bg-[#468432] hover:bg-[#1A5C05] text-white px-8 py-3 rounded-md font-bold transition"
                  >
                    Complete Cooking
                  </button>
                )}
              </div>

            </div>
          </div>
        </section>
      </main>
    </>
  );
}
