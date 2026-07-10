import { useEffect, useRef, useState } from "react";
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
  const [imagePreview, setImagePreview] = useState(null);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [status, setStatus] = useState("pending");

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  const fileInputRef = useRef(null);

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
    setImagePreview(found.image || null);
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

  // ---------------- IMAGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (imagePreview && image) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (imagePreview && image) {
      URL.revokeObjectURL(imagePreview);
    }

    setImage(null);
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (imagePreview && image) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, image]);

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
    if (ingredients.length === 1) {
      setIngredients([""]);
      return;
    }

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
    if (steps.length === 1) {
      setSteps([""]);
      return;
    }

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
  const handleSave = (e, selectedStatus) => {
    e.preventDefault();

    const localRecipes = JSON.parse(localStorage.getItem("recipes")) || [];

    const updatedRecipe = {
      id: isNaN(Number(id)) ? id : Number(id),
      title,
      image: image ? URL.createObjectURL(image) : imagePreview,
      prepTime,
      cookTime,
      servings,
      status: selectedStatus,
      ingredients: ingredients.filter((item) => item.trim() !== ""),
      steps: steps.filter((step) => step.trim() !== ""),
      createdAt: new Date().toISOString(),
    };

    setStatus(selectedStatus);

    const exists = localRecipes.some((r) => String(r.id) === String(id));

    const updatedList = exists
      ? localRecipes.map((r) =>
          String(r.id) === String(id) ? updatedRecipe : r
        )
      : [...localRecipes, updatedRecipe];

    localStorage.setItem("recipes", JSON.stringify(updatedList));

    alert(
      selectedStatus === "public"
        ? "Recipe updated and published"
        : "Recipe updated and saved as pending"
    );

    navigate("/admin");
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="p-8 text-center">Loading...</div>
      </>
    );
  }

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

      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 md:p-8">
          <h1 className="text-4xl font-bold mb-6">
            Edit Recipe
          </h1>

          <form className="space-y-6">
            {/* TITLE AND IMAGE */}
            <div className="shadow bg-white rounded-xl p-6 border border-[#468432]">
              {/* TITLE */}
              <div>
                <label className="block font-medium mb-2 text-xl">
                  Recipe Title
                </label>

                <input
                  type="text"
                  className="w-full border rounded-lg p-3 outline-none focus:border-[#468432]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter recipe name"
                  required
                />
              </div>

              {/* IMAGE */}
              <div className="mt-6">
                <label
                  htmlFor="imageUpload"
                  className="relative h-[300px] rounded-[40px] border-2 border-dashed border-gray-400 bg-[#EAF1E7] flex items-center justify-center cursor-pointer overflow-hidden"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Recipe preview"
                        className="w-full h-full object-cover text-gray-50"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-4 right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white text-2xl rounded-full flex items-center justify-center"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="text-center">
                      <div className="text-5xl">📷</div>

                      <p className="text-2xl font-bold mt-3 text-gray-400">
                        Upload Hero Photo
                      </p>
                    </div>
                  )}
                </label>

                <input
                  ref={fileInputRef}
                  id="imageUpload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <p className="text-center text-gray-500 mt-3">
                  {imagePreview
                    ? "Click the image to change it"
                    : "Click to upload an image"}
                </p>
              </div>
            </div>

            {/* TIME AND SERVINGS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-[#468432] p-4 rounded-lg">
                <label className="block font-medium mb-2">
                  Prep Time (min)
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full border rounded-lg p-3 outline-none"
                  value={prepTime}
                  onChange={(e) => setPrepTime(e.target.value)}
                  placeholder="Enter prep time"
                />
              </div>

              <div className="border border-[#468432] p-4 rounded-lg">
                <label className="block font-medium mb-2">
                  Cooking Time (min)
                </label>

                <input
                  type="number"
                  min="0"
                  className="w-full border rounded-lg p-3 outline-none"
                  value={cookTime}
                  onChange={(e) => setCookTime(e.target.value)}
                  placeholder="Enter cooking time"
                />
              </div>

              <div className="border border-[#468432] p-4 rounded-lg">
                <label className="block font-medium mb-2">
                  Servings
                </label>

                <input
                  type="number"
                  min="1"
                  className="w-full border rounded-lg p-3 outline-none"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="Enter servings"
                />
              </div>
            </div>

            {/* INGREDIENTS */}
            <div className="border border-[#468432] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Ingredients
                </h2>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="text-[#468432] font-semibold"
                >
                  + Add
                </button>
              </div>

              {ingredients.map((item, index) => (
                <div
                  key={index}
                  className="flex gap-2 mb-3"
                >
                  <input
                    type="text"
                    className="flex-1 border p-3 rounded-lg outline-none"
                    value={item}
                    onChange={(e) =>
                      handleIngredientChange(
                        e.target.value,
                        index
                      )
                    }
                    placeholder={`Ingredient ${index + 1}`}
                  />

                  <button
                    type="button"
                    onClick={() => moveIngredient(index, -1)}
                    disabled={index === 0}
                    className="px-3 bg-gray-200 rounded-lg disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveIngredient(index, 1)}
                    disabled={index === ingredients.length - 1}
                    className="px-3 bg-gray-200 rounded-lg disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => removeIngredient(index)}
                    className="px-3 bg-red-500 text-white rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* COOKING STEPS */}
            <div className="border border-[#468432] p-4 rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">
                  Cooking Steps
                </h2>

                <button
                  type="button"
                  onClick={addStep}
                  className="text-[#468432] font-semibold"
                >
                  + Add
                </button>
              </div>

              {steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-2 mb-3"
                >
                  <textarea
                    className="flex-1 border p-3 rounded-lg outline-none resize-none"
                    value={step}
                    onChange={(e) =>
                      handleStepChange(e.target.value, index)
                    }
                    placeholder={`Step ${index + 1}`}
                    rows="2"
                  />

                  <button
                    type="button"
                    onClick={() => moveStep(index, -1)}
                    disabled={index === 0}
                    className="px-3 bg-gray-200 rounded-lg disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveStep(index, 1)}
                    disabled={index === steps.length - 1}
                    className="px-3 bg-gray-200 rounded-lg disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="px-3 bg-red-500 text-white rounded-lg"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* SAVE */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

              <button
                type="button"
                onClick={(e) => handleSave(e, "public")}
                className="bg-[#FFA02E] text-black px-6 py-3 rounded-lg md:col-span-3"
              >
                Save & Publish
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}