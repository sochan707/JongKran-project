import { useState } from "react";
import { Search, ShoppingBasket } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

const commonIngredients = [
  { name: "Garlic", image: "https://images.unsplash.com/photo-1615485290382-441e4d049cb5" },
  { name: "Rice", image: "https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6" },
  { name: "Salmon", image: "https://images.unsplash.com/photo-1485921325833-c519f76c4927" },
  { name: "Carrot", image: "https://images.unsplash.com/photo-1447175008436-054170c2e979" },
  { name: "Egg", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03" },
  { name: "Cheese", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d" },
];

export default function InputIngredients() {
  const [ingredients, setIngredients] = useState([]);
  const [input, setInput] = useState("");
  const navigate = useNavigate();

  const addIngredient = (name) => {
    if (!ingredients.includes(name)) {
      setIngredients([...ingredients, name]);
    }
    setInput("");
  };

  return (
    <>
      <Header />

      <main className="mx-[25px] py-12 ml-10">
        <h1 className="title-font text-4xl md:text-4xl font-bold">
          What’s in your Kitchen?
        </h1>

        <p className="mt-3 text-gray-600">
          Enter your ingredients and discover the perfect recipe.
        </p>

        <div className="grid lg:grid-cols-2 gap-8 mt-10">
          <section className="border border-gray-300 rounded-xl p-6">
            <div className="relative mb-8">
              <Search className="absolute left-4 top-4 text-black" size={18} />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && input.trim()) {
                    addIngredient(input.trim());
                  }
                }}
                placeholder="Add ingredients (e.g. egg...)"
                className="w-full rounded-lg bg-gray-100 border border-gray-300 px-4 py-3 focus:outline-none focus:ring-[1px] focus:ring-[#468432] pl-10"
              />
            </div>


            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {commonIngredients.map((item) => (
                <button
                  key={item.name}
                  onClick={() => addIngredient(item.name)}
                  className="border rounded-xl overflow-hidden hover:shadow"
                >
                  <img src={item.image} className="h-36 w-full object-cover" />
                  <p className="py-2 font-semibold">{item.name}</p>
                </button>
              ))}
            </div>
          </section>

          <section className="bg-[#E5F1E2] rounded-xl p-6 shadow">
            <h2 className="title-font text-2xl font-bold text-[#468432]">
              Your Ingredients
            </h2>

            <div className="mt-5 space-y-3 min-h-[280px]">
              {ingredients.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-gray-500 mt-20">
                  <ShoppingBasket size={40} />
                  <p className="mt-3 text-center">
                    Add more to find perfect matches
                  </p>
                </div>
              ) : (
                ingredients.map((item) => (
                  <div key={item} className="bg-white rounded-md px-4 py-3">
                    {item}
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => {
                localStorage.setItem("selectedIngredients", JSON.stringify(ingredients));
                navigate("/matched-recipes");
              }}
              className="w-full mt-8 bg-[#468432] hover:bg-[#1A5C05] text-white py-4 rounded-md font-bold"
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