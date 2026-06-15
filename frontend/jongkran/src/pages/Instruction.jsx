import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const recipe = {
  id: 1,
  name: "Beef Lok Lak",
  image:
    "https://images.unsplash.com/photo-1544025162-d76694265947",
  time: 20,
  difficulty: "Easy",
  servings: 4,
};

const steps = [
  "Pat the salmon fillets dry with paper towels. Season both sides generously with salt, black pepper, and half of the minced garlic.",
  "Heat oil in a pan and cook the beef until brown.",
  "Add sauce and vegetables, then stir well.",
  "Serve hot with rice.",
];

export default function Instruction() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  const completeCooking = () => {
    const savedHistory =
      JSON.parse(localStorage.getItem("history")) || [];

    const alreadyExists = savedHistory.some(
      (item) => item.id === recipe.id
    );

    if (!alreadyExists) {
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
    }

    navigate("/history");
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

            <p className="mt-2">
              {recipe.time} min • {recipe.difficulty} •{" "}
              {recipe.servings} servings
            </p>
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
              <div className="flex justify-end mt-8">
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