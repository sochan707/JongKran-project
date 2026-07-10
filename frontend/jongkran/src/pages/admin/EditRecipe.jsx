import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Header from "../../components/Header";
import recipeData from "../../data/recipes";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [currentImageUrl, setCurrentImageUrl] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [status, setStatus] = useState("pending");

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  // ---------------- LOAD EXISTING RECIPE ----------------
  useEffect(() => {
    const localRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const formattedRecipes = recipeData.map((r) => ({
      ...r,
      title: r.name,
      status: r.status || "public",
      createdAt: r.createdAt || "2026-07-06",
    }));

    const allRecipes = [...formattedRecipes, ...localRecipes];

    const found = allRecipes.find((r) => String(r.id) === String(id));

    if (!found) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    setTitle(found.title || "");
    setCurrentImageUrl(found.image || "");
    setPrepTime(found.prepTime || "");
    setCookTime(found.cookTime || "");
    setServings(found.servings || "");
    setStatus(found.status || "pending");
    setIngredients(
      found.ingredients && found.ingredients.length ? found.ingredients : [""]
    );
    setSteps(found.steps && found.steps.length ? found.steps : [""]);

    setLoading(false);
  }, [id]);

  // ---------------- INGREDIENTS ----------------
  const handleIngredientChange = (value, index) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const addIngredient = () => {
    setIngredients([...ingredients, ""]);
  };

  const removeIngredient = (index) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated);
  };

  const moveIngredient = (index, direction) => {
    const updated = [...ingredients];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= updated.length) return;

    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    setIngredients(updated);
  };

  // ---------------- STEPS ----------------
  const handleStepChange = (value, index) => {
    const updated = [...steps];
    updated[index] = value;
    setSteps(updated);
  };

  const addStep = () => {
    setSteps([...steps, ""]);
  };

  const removeStep = (index) => {
    const updated = steps.filter((_, i) => i !== index);
    setSteps(updated);
  };

  const moveStep = (index, direction) => {
    const updated = [...steps];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= updated.length) return;

    [updated[index], updated[newIndex]] = [updated[newIndex], updated[index]];

    setSteps(updated);
  };

  // ---------------- SAVE ----------------
  const saveChanges = (newStatus) => {
    const localRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const updatedRecipe = {
      id: isNaN(Number(id)) ? id : Number(id),
      title,
      image: image ? URL.createObjectURL(image) : currentImageUrl,
      prepTime,
      cookTime,
      servings,
      status: newStatus,
      ingredients,
      steps,
      createdAt: new Date().toISOString(),
    };

    const exists = localRecipes.some((r) => String(r.id) === String(id));

    const updatedList = exists
      ? localRecipes.map((r) =>
          String(r.id) === String(id) ? updatedRecipe : r
        )
      : [...localRecipes, updatedRecipe];

    localStorage.setItem("recipes", JSON.stringify(updatedList));
    navigate("/admin");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    saveChanges(status);
  };

  if (loading) return <p className="p-8">Loading...</p>;

  if (notFound) {
    return (
      <>
        <Header />
        <div className="p-8 text-center">
          <p className="text-lg font-semibold">Recipe not found.</p>
          <button
            onClick={() => navigate("/admin")}
            className="mt-4 text-[#468432] font-medium underline"
          >
            Back to Recipe Management
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
          <h1 className="text-4xl font-bold mb-6">Edit Recipe</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-6 mt-6 shadow max-w-4xl mx-auto bg-white rounded-xl p-6 border-[1px] border-[#468432]">
              {/* TITLE */}
              <div>
                <label className="block font-medium mb-1 text-xl">
                  Recipe Title
                </label>
                <input
                  className="w-full border rounded p-3"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter recipe name"
                />
              </div>

              {/* IMAGE */}
              <div>
                {currentImageUrl && !image && (
                  <img
                    src={currentImageUrl}
                    alt={title}
                    className="w-32 h-32 object-cover rounded mt-4"
                  />
                )}

                <div className="mb-6 mt-6">
                  <input
                    type="file"
                    className="w-full"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </div>
              </div>
            </div>

            {/* PREP + COOK + SERVINGS */}
            <div>
              <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto bg-white rounded-xl">
                <div className="border-[1px] border-[#468432] p-4 rounded-lg">
                  <label className="block font-medium mb-1">
                    Prep Time(min)
                  </label>
                  <input
                    className="w-full border rounded p-3"
                    value={prepTime}
                    onChange={(e) => setPrepTime(e.target.value)}
                    placeholder="Enter prep time"
                  />
                </div>
                <div className="border-[1px] border-[#468432] p-4 rounded-lg">
                  <label className="block font-medium mb-1">
                    Cooking Time(min)
                  </label>
                  <input
                    className="w-full border p-3 rounded"
                    placeholder="Enter cooking time"
                    value={cookTime}
                    onChange={(e) => setCookTime(e.target.value)}
                  />
                </div>
                <div className="border-[1px] border-[#468432] p-4 rounded-lg">
                  <label className="block font-medium mb-1">Servings</label>
                  <input
                    className="w-full border p-3 rounded"
                    placeholder="Enter servings"
                    value={servings}
                    onChange={(e) => setServings(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* INGREDIENTS */}
            <div className="border-[1px] border-[#468432] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Ingredients</h2>
                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-green-600 font-medium"
                >
                  + Add
                </button>
              </div>

              {ingredients.map((item, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className="flex-1 border p-2 rounded"
                    value={item}
                    onChange={(e) =>
                      handleIngredientChange(e.target.value, index)
                    }
                    placeholder={`Ingredient ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => moveIngredient(index, -1)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveIngredient(index, 1)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-2 bg-red-500 text-white rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* STEPS */}
            <div className="border-[1px] border-[#468432] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <h2 className="font-semibold">Cooking Steps</h2>
                <button
                  type="button"
                  onClick={addStep}
                  className="text-green-600 font-medium"
                >
                  + Add
                </button>
              </div>

              {steps.map((step, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    className="flex-1 border p-2 rounded"
                    value={step}
                    onChange={(e) => handleStepChange(e.target.value, index)}
                    placeholder={`Step ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => moveStep(index, -1)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveStep(index, 1)}
                    className="px-2 bg-gray-200 rounded"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="px-2 bg-red-500 text-white rounded"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* SAVE */}
            <div className="grid grid-cols-5 gap-4 max-w-4xl mx-auto bg-white rounded-xl">
              <button
                type="button"
                onClick={() => saveChanges("pending")}
                className="bg-white border-[1px] border-[#FFA02E] p-4 text-black px-6 py-3 rounded-lg col-span-2"
              >
                Save as Pending
              </button>
              <button
                type="button"
                onClick={() => saveChanges("public")}
                className="bg-[#FFA02E] text-black px-6 py-3 rounded-lg col-span-3"
              >
                Save as Public
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}