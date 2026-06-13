import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const steps = [
  "Pat the salmon fillets dry with paper towels. Season both sides generously with salt, black pepper, and half of the minced garlic.",
  "Heat oil in a pan and cook the beef until brown.",
  "Add sauce and vegetables, then stir well.",
  "Serve hot with rice.",
];

export default function Instruction() {
  const [step, setStep] = useState(0);
  const navigate = useNavigate();

  return (
    <>
      <Header />

      <main>
        <section className="relative h-[320px] bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947')] bg-cover bg-center">
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

            <h1 className="title-font text-5xl font-bold">Beef Lok Lak</h1>
            <p className="mt-2">20 min • Easy • 4 servings</p>
          </div>
        </section>

        <section className="mx-[25px] py-8 max-w-3xl">
          <div className="flex border-b mb-8">
            <button
              onClick={() => navigate("/recipe/1")}
              className="flex-1 py-4 font-bold"
            >
              Ingredients
            </button>

            <button className="flex-1 py-4 text-[#468432] border-b-2 border-[#468432] font-bold">
              Instructions
            </button>
          </div>

          <h2 className="title-font text-3xl font-bold">Cooking Steps</h2>

          <div className="h-4 bg-gray-300 rounded-full mt-5">
            <div
              className="h-4 bg-[#468432] rounded-full"
              style={{ width: `${((step + 1) / steps.length) * 100}%` }}
            />
          </div>

          <h3 className="title-font text-2xl text-[#468432] font-bold mt-8">
            Step {step + 1}
          </h3>

          <p className="mt-4 leading-7">{steps[step]}</p>

          {step < steps.length - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              className="mt-8 bg-[#468432] hover:bg-[#1A5C05] text-white px-8 py-3 rounded-md font-bold"
            >
              Next Step
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="mt-8 bg-[#468432] hover:bg-[#1A5C05] text-white px-8 py-3 rounded-md font-bold"
            >
              Complete Cooking
            </button>
          )}
        </section>
      </main>
    </>
  );
}