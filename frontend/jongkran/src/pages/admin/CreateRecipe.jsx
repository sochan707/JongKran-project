import { useState } from "react";

export default function CreateRecipe() {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [prepTime, setPrepTime] = useState("");
  const [servings, setServings] = useState("");
  const [status, setStatus] = useState("pending");

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  // ---------------- INGREDIENTS ----------- -----
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

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

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

    [updated[index], updated[newIndex]] = [
      updated[newIndex],
      updated[index],
    ];

    setSteps(updated);
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = (e) => {
    e.preventDefault();

    const newRecipe = {
      title,
      image,
      prepTime,
      servings,
      status,
      ingredients,
      steps,
      createdAt: new Date().toISOString(),
    };

    console.log("Created Recipe:", newRecipe);

    alert("Recipe created (check console)");
  };

  return (

    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">
        <h1 className="text-5xl font-bold mb-6">Create Recipe</h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* TITLE */}
          <div>
            <label className="block font-medium mb-1">Recipe Title</label>
            <input
              className="w-full border rounded p-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter recipe name"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="block font-medium mb-1">Image</label>
            <input
              type="file"
              className="w-full"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </div>

          {/* PREP + SERVINGS */}
          <div className="grid grid-cols-2 gap-4">
            <input
              className="border p-3 rounded"
              placeholder="Prep Time (min)"
              value={prepTime}
              onChange={(e) => setPrepTime(e.target.value)}
            />
            <input
              className="border p-3 rounded"
              placeholder="Servings"
              value={servings}
              onChange={(e) => setServings(e.target.value)}
            />
          </div>

          {/* STATUS */}
          <div>
            <label className="block font-medium mb-2">Status</label>
            <select
              className="border p-3 rounded w-full"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* INGREDIENTS */}
          <div>
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
          <div>
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
                <textarea
                  className="flex-1 border p-2 rounded"
                  value={step}
                  onChange={(e) =>
                    handleStepChange(e.target.value, index)
                  }
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

          {/* SUBMIT */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-green-700 text-white px-6 py-3 rounded-lg"
            >
              Create Recipe
            </button>
          </div>
        </form>
      </div>
    </div>

  );
} 