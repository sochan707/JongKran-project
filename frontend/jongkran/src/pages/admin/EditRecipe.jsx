import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recipes")) || [];
    const found = data.find(r => r.id === Number(id));
    setRecipe(found);
  }, [id]);

  const updateRecipe = () => {
    const data = JSON.parse(localStorage.getItem("recipes")) || [];

    const updated = data.map(r =>
      r.id === Number(id) ? recipe : r
    );

    localStorage.setItem("recipes", JSON.stringify(updated));
    navigate("/admin");
  };

  if (!recipe) return <p>Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">

      <h1 className="text-2xl font-bold mb-4">Edit Recipe</h1>

      <input
        className="border p-2 w-full mb-2"
        value={recipe.title}
        onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
      />

      <input
        className="border p-2 w-full mb-2"
        value={recipe.image}
        onChange={(e) => setRecipe({ ...recipe, image: e.target.value })}
      />

      <button
        onClick={updateRecipe}
        className="bg-green-700 text-white px-4 py-2"
      >
        Save Changes
      </button>

    </div>
  );
}