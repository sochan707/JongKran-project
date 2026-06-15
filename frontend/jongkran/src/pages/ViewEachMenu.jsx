import { useNavigate, useParams } from "react-router-dom";
import Header from "../components/Header";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";


export default function ViewEachMenu() {
  const navigate = useNavigate();

  const [yourIngredients, setYourIngredients] = useState([
    "Pinch of Sea Salt & Black Pepper",
    "200g Beef",
    "1 tbsp Soy Sauce",
  ]);

  const [missingIngredients, setMissingIngredients] = useState([
    "1 Onion",
    "1 Tomato",
  ]);

  const addMissing = (item) => {
    setYourIngredients([...yourIngredients, item]);
    setMissingIngredients(missingIngredients.filter((i) => i !== item));
  };

  const removeYourIngredient = (item) => {
    setMissingIngredients([...missingIngredients, item]);
    setYourIngredients(yourIngredients.filter((i) => i !== item));
  }

  return (
    <>
      <Header />

      <main>
        <section className="relative h-[360px] bg-[url('https://images.unsplash.com/photo-1544025162-d76694265947')] bg-cover bg-center">
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

        <section className="mx-[25px] py-8">
          <div className="flex border-b mb-8">
            <button className="flex-1 py-4 text-[#468432] border-b-2 border-[#468432] font-bold">
              Ingredients
            </button>

            <button
              onClick={() => navigate("/instruction/1")}
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