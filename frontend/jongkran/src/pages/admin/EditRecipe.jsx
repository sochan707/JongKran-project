import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest } from "../../lib/api";
import recipeData from "../../data/recipes";
import { RECIPE_PLACEHOLDER, handleRecipeImageError, } from "../../lib/recipeImage";

export default function EditRecipe() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [title, setTitle] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");
  const [status, setStatus] = useState("pending");
  const [createdAt, setCreatedAt] = useState("");

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  const fileInputRef = useRef(null);

  // ---------------- LOAD RECIPE ----------------
  useEffect(() => {
    apiRequest(`/recipes/${id}`).then(({ data: foundRecipe }) => {

    setTitle(
      foundRecipe.title || foundRecipe.name || ""
    );

    setImagePreview(foundRecipe.image_url || null);
    setPrepTime(foundRecipe.prep_time || "");
    setCookTime(foundRecipe.cook_time || "");
    setServings(foundRecipe.servings || "");
    setStatus("public");

    setCreatedAt(
      foundRecipe.created_at || new Date().toISOString()
    );

    setIngredients(
      foundRecipe.recipeIngredients?.length
        ? foundRecipe.recipeIngredients.map((item) => item.ingredient?.name).filter(Boolean)
        : [""]
    );

    setSteps(
      foundRecipe.steps?.length
        ? foundRecipe.steps.map((step) => step.instruction_text)
        : [""]
    );

    setLoading(false);
    }).catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  // ---------------- IMAGE ----------------
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;
    setImageFile(file);

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2MB.");
      e.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.onerror = () => {
      alert("Could not read the selected image.");
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setImagePreview(null);
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

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

    setIngredients(
      ingredients.filter(
        (_, currentIndex) => currentIndex !== index
      )
    );
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
    if (steps.length === 1) {
      setSteps([""]);
      return;
    }

    setSteps(
      steps.filter(
        (_, currentIndex) => currentIndex !== index
      )
    );
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

  // ---------------- SAVE ----------------
  const handleSave = async (e) => {
    e.preventDefault();

    const cleanIngredients = ingredients.filter(
      (ingredient) => ingredient.trim() !== ""
    );

    const cleanSteps = steps.filter(
      (step) => step.trim() !== ""
    );

    if (!title.trim()) {
      alert("Please enter the recipe title.");
      return;
    }

    if (!imagePreview) {
      alert("Please upload a recipe image.");
      return;
    }

    if (cleanIngredients.length === 0) {
      alert("Please add at least one ingredient.");
      return;
    }

    if (cleanSteps.length === 0) {
      alert("Please add at least one cooking step.");
      return;
    }

    try {
      let imageUrl = imagePreview;
      if (imageFile) {
        const imageBody = new FormData();
        imageBody.append("image", imageFile);
        const upload = await apiRequest("/uploads/recipe-image", { method: "POST", body: imageBody });
        imageUrl = upload.data?.image_url;
      }
      await apiRequest(`/recipes/${id}`, { method: "PATCH", body: JSON.stringify({
      title: title.trim(),
      image_url: imageUrl,
      difficulty: "easy",
      prep_time: Number(prepTime),
      cook_time: Number(cookTime),
      servings: Number(servings),
      ingredients: cleanIngredients,
      steps: cleanSteps,
      }) });
    } catch (error) {
      alert(error.message);
      return;
    }

    alert("Recipe updated successfully.");

    navigate("/admin");
  };

  if (loading) {
    return (
      <>
        <AdminHeader />

        <div className="p-8 text-center">
          Loading...
        </div>
      </>
    );
  }

  if (notFound) {
    return (
      <>
        <AdminHeader />

        <div className="p-8 text-center">
          <p className="text-lg font-semibold">
            Recipe not found.
          </p>

          <button
            type="button"
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
      <AdminHeader />

      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6 md:p-8">
          <h1 className="text-4xl font-bold mb-6">
            Edit Recipe
          </h1>

          <form className="space-y-6">
            {/* TITLE AND IMAGE */}
            <div className="shadow bg-white rounded-xl p-6 border border-[#468432]">
              <div>
                <label className="block font-medium mb-2 text-xl">
                  Recipe Title
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter recipe name"
                  className="w-full border rounded-lg p-3 outline-none focus:border-[#468432]"
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
                        className="w-full h-full object-cover"
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
                  onChange={handleImageChange}
                  className="hidden"
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
                  value={prepTime}
                  onChange={(e) =>
                    setPrepTime(e.target.value)
                  }
                  placeholder="Enter prep time"
                  className="w-full border rounded-lg p-3 outline-none"
                />
              </div>

              <div className="border border-[#468432] p-4 rounded-lg">
                <label className="block font-medium mb-2">
                  Cooking Time (min)
                </label>

                <input
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(e) =>
                    setCookTime(e.target.value)
                  }
                  placeholder="Enter cooking time"
                  className="w-full border rounded-lg p-3 outline-none"
                />
              </div>

              <div className="border border-[#468432] p-4 rounded-lg">
                <label className="block font-medium mb-2">
                  Servings
                </label>

                <input
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(e) =>
                    setServings(e.target.value)
                  }
                  placeholder="Enter servings"
                  className="w-full border rounded-lg p-3 outline-none"
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

              {ingredients.map((ingredient, index) => (
                <div
                  key={index}
                  className="flex gap-2 mb-3"
                >
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) =>
                      handleIngredientChange(
                        e.target.value,
                        index
                      )
                    }
                    placeholder={`Ingredient ${index + 1}`}
                    className="flex-1 border p-3 rounded-lg outline-none"
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
                    disabled={
                      index === ingredients.length - 1
                    }
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

            {/* STEPS */}
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
                    value={step}
                    onChange={(e) =>
                      handleStepChange(
                        e.target.value,
                        index
                      )
                    }
                    placeholder={`Step ${index + 1}`}
                    rows="2"
                    className="flex-1 border p-3 rounded-lg outline-none resize-none"
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
            <button
              type="button"
              onClick={(e) =>
                handleSave(e)
              }
              className="w-full bg-[#FFA02E] text-black px-6 py-3 rounded-lg"
            >
              Save Recipe
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
