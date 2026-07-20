import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "../../components/AdminHeader";
import { apiRequest } from "../../lib/api";
import { ImagePlus } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function CreateRecipe() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [prepTime, setPrepTime] = useState("");
  const [cookTime, setCookTime] = useState("");
  const [servings, setServings] = useState("");

  const [ingredients, setIngredients] = useState([""]);
  const [steps, setSteps] = useState([""]);

  const [submittingStatus, setSubmittingStatus] =
    useState("");

  // ---------------- IMAGE ----------------

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");

      event.target.value = "";
      setImageFile(null);
      setImagePreview(null);

      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Please choose an image smaller than 2MB.");

      event.target.value = "";
      setImageFile(null);
      setImagePreview(null);

      return;
    }

    setImageFile(file);

    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result);
    };

    reader.onerror = () => {
      alert("Could not read the selected image.");

      setImageFile(null);
      setImagePreview(null);
      event.target.value = "";
    };

    reader.readAsDataURL(file);
  };

  const removeImage = (event) => {
    event.preventDefault();
    event.stopPropagation();

    setImagePreview(null);
    setImageFile(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ---------------- INGREDIENTS ----------------

  const handleIngredientChange = (value, index) => {
    const updatedIngredients = [...ingredients];

    updatedIngredients[index] = value;

    setIngredients(updatedIngredients);
  };

  const addIngredient = () => {
    setIngredients((currentIngredients) => [
      ...currentIngredients,
      "",
    ]);
  };

  const removeIngredient = (index) => {
    if (ingredients.length === 1) {
      setIngredients([""]);
      return;
    }

    setIngredients((currentIngredients) =>
      currentIngredients.filter(
        (_, currentIndex) => currentIndex !== index
      )
    );
  };

  const moveIngredient = (index, direction) => {
    const updatedIngredients = [...ingredients];
    const newIndex = index + direction;

    if (
      newIndex < 0 ||
      newIndex >= updatedIngredients.length
    ) {
      return;
    }

    [
      updatedIngredients[index],
      updatedIngredients[newIndex],
    ] = [
      updatedIngredients[newIndex],
      updatedIngredients[index],
    ];

    setIngredients(updatedIngredients);
  };

  // ---------------- STEPS ----------------

  const handleStepChange = (value, index) => {
    const updatedSteps = [...steps];

    updatedSteps[index] = value;

    setSteps(updatedSteps);
  };

  const addStep = () => {
    setSteps((currentSteps) => [...currentSteps, ""]);
  };

  const removeStep = (index) => {
    if (steps.length === 1) {
      setSteps([""]);
      return;
    }

    setSteps((currentSteps) =>
      currentSteps.filter(
        (_, currentIndex) => currentIndex !== index
      )
    );
  };

  const moveStep = (index, direction) => {
    const updatedSteps = [...steps];
    const newIndex = index + direction;

    if (newIndex < 0 || newIndex >= updatedSteps.length) {
      return;
    }

    [updatedSteps[index], updatedSteps[newIndex]] = [
      updatedSteps[newIndex],
      updatedSteps[index],
    ];

    setSteps(updatedSteps);
  };

  // ---------------- VALIDATION ----------------

  const validateForm = (cleanIngredients, cleanSteps) => {
    if (!title.trim()) {
      alert("Please enter the recipe title.");
      return false;
    }

    if (!description.trim()) {
      alert("Please enter the recipe description.");
      return false;
    }

    if (!imageFile) {
      alert("Please upload a recipe image.");
      return false;
    }

    if (prepTime === "" || Number(prepTime) < 0) {
      alert("Please enter a valid prep time.");
      return false;
    }

    if (cookTime === "" || Number(cookTime) < 0) {
      alert("Please enter a valid cooking time.");
      return false;
    }

    if (servings === "" || Number(servings) < 1) {
      alert("Please enter a valid number of servings.");
      return false;
    }

    if (cleanIngredients.length === 0) {
      alert("Please add at least one ingredient.");
      return false;
    }

    if (cleanSteps.length === 0) {
      alert("Please add at least one cooking step.");
      return false;
    }

    return true;
  };

  // ---------------- CREATE RECIPE ----------------

  const handleSubmit = async (event, selectedStatus) => {
    event.preventDefault();

    if (submittingStatus) return;

    const cleanIngredients = ingredients
      .map((ingredient) => ingredient.trim())
      .filter(Boolean);

    const cleanSteps = steps
      .map((step) => step.trim())
      .filter(Boolean);

    const isValid = validateForm(
      cleanIngredients,
      cleanSteps
    );

    if (!isValid) return;

    try {
      setSubmittingStatus(selectedStatus);

      // Upload image first
      const imageBody = new FormData();

      imageBody.append("image", imageFile);

      const uploadResponse = await apiRequest(
        "/uploads/recipe-image",
        {
          method: "POST",
          body: imageBody,
        }
      );

      const imageUrl = uploadResponse.data?.image_url;

      if (!imageUrl) {
        throw new Error(
          "The recipe image could not be uploaded."
        );
      }

      // Create recipe
      await apiRequest("/recipes", {
        method: "POST",

        body: JSON.stringify({
          title: title.trim(),

          // New description field
          description: description.trim(),

          image_url: imageUrl,
          difficulty: "easy",
          prep_time: Number(prepTime),
          cook_time: Number(cookTime),
          servings: Number(servings),
          status: selectedStatus,
          ingredients: cleanIngredients,
          steps: cleanSteps,
        }),
      });

      navigate("/admin", {
        state: {
          successMessage:
            selectedStatus === "public"
              ? "Recipe published successfully!"
              : "Recipe saved as pending!",
        },
      });
    } catch (error) {
      console.error("Create recipe error:", error);

      alert(
        error.message ||
          "Could not create the recipe. Please try again."
      );
    } finally {
      setSubmittingStatus("");
    }
  };

  return (
    <>
      <AdminHeader />

      <div className="min-h-screen bg-gray-100 p-4 md:p-8">
        <div className="mx-auto max-w-4xl rounded-xl bg-white p-6 shadow md:p-8">
          <h1 className="mb-6 text-4xl font-bold">
            Create New Recipe
          </h1>

          <form
            className="space-y-6"
            onSubmit={(event) => event.preventDefault()}
          >
            {/* BASIC RECIPE INFORMATION */}
            <div className="rounded-xl border border-[#468432] bg-white p-6 shadow">
              {/* TITLE */}
              <div>
                <label
                  htmlFor="recipeTitle"
                  className="mb-2 block text-xl font-medium"
                >
                  Recipe Title
                </label>

                <input
                  id="recipeTitle"
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
                  placeholder="Enter recipe name"
                  maxLength={150}
                  className="w-full rounded-lg border p-3 outline-none focus:border-[#468432]"
                />
              </div>

              {/* DESCRIPTION */}
              <div className="mt-6">
                <label
                  htmlFor="recipeDescription"
                  className="mb-2 block text-xl font-medium"
                >
                  Description
                </label>

                <input
                  id="recipeDescription"
                  value={description}
                  onChange={(event) =>
                    setDescription(event.target.value)
                  }
                  placeholder="Describe the recipe, its taste, background, and what makes it special"
                  rows={5}
                  maxLength={500}
                  className="w-full resize-y rounded-lg border p-3 leading-7 outline-none focus:border-[#468432]"
                />

                <p className="mt-2 text-right text-sm text-gray-500">
                  {description.length}/500
                </p>
              </div>

              {/* IMAGE */}
              <div className="mt-6">
                <p className="mb-5 block text-xl font-medium">
                  Recipe Image
                </p>

                <label
                  htmlFor="imageUpload"
                  className="relative flex h-[300px] cursor-pointer items-center justify-center overflow-hidden rounded-[40px] border-2 border-dashed border-gray-400 bg-[#EAF1E7]"
                >
                  {imagePreview ? (
                    <>
                      <img
                        src={imagePreview}
                        alt="Recipe preview"
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={removeImage}
                        aria-label="Remove recipe image"
                        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-2xl text-white hover:bg-red-600"
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div className="flex flex-col items-center text-center">
                      <ImagePlus
                        size={60}
                        strokeWidth={1.8}
                        className="text-gray-400"
                      />

                      <p className="mt-3 text-2xl font-bold text-gray-400">
                        Upload Hero Photo
                      </p>

                      <p className="mt-2 text-sm text-gray-400">
                        PNG, JPG or WEBP — maximum file size: 5MB
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

                <p className="mt-3 text-center text-gray-500">
                  {imagePreview
                    ? "Click the image to choose another image"
                    : "Click to upload an image"}
                </p>
              </div>
            </div>

            {/* TIME AND SERVINGS */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {/* PREP TIME */}
              <div className="rounded-lg border border-[#468432] p-4">
                <label
                  htmlFor="prepTime"
                  className="mb-2 block font-medium"
                >
                  Prep Time (min)
                </label>

                <input
                  id="prepTime"
                  type="number"
                  min="0"
                  value={prepTime}
                  onChange={(event) =>
                    setPrepTime(event.target.value)
                  }
                  placeholder="Enter prep time"
                  className="w-full rounded-lg border p-3 outline-none focus:border-[#468432]"
                />
              </div>

              {/* COOK TIME */}
              <div className="rounded-lg border border-[#468432] p-4">
                <label
                  htmlFor="cookTime"
                  className="mb-2 block font-medium"
                >
                  Cooking Time (min)
                </label>

                <input
                  id="cookTime"
                  type="number"
                  min="0"
                  value={cookTime}
                  onChange={(event) =>
                    setCookTime(event.target.value)
                  }
                  placeholder="Enter cooking time"
                  className="w-full rounded-lg border p-3 outline-none focus:border-[#468432]"
                />
              </div>

              {/* SERVINGS */}
              <div className="rounded-lg border border-[#468432] p-4">
                <label
                  htmlFor="servings"
                  className="mb-2 block font-medium"
                >
                  Servings
                </label>

                <input
                  id="servings"
                  type="number"
                  min="1"
                  value={servings}
                  onChange={(event) =>
                    setServings(event.target.value)
                  }
                  placeholder="Enter servings"
                  className="w-full rounded-lg border p-3 outline-none focus:border-[#468432]"
                />
              </div>
            </div>

            {/* INGREDIENTS */}
            <div className="rounded-lg border border-[#468432] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Ingredients
                </h2>

                <button
                  type="button"
                  onClick={addIngredient}
                  className="font-semibold text-[#468432] hover:text-[#1A5C05]"
                >
                  + Add
                </button>
              </div>

              {ingredients.map((ingredient, index) => (
                <div
                  key={`ingredient-${index}`}
                  className="mb-3 flex gap-2"
                >
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(event) =>
                      handleIngredientChange(
                        event.target.value,
                        index
                      )
                    }
                    placeholder={`Ingredient ${index + 1}`}
                    className="min-w-0 flex-1 rounded-lg border p-3 outline-none focus:border-[#468432]"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      moveIngredient(index, -1)
                    }
                    disabled={index === 0}
                    aria-label="Move ingredient up"
                    className="rounded-lg bg-gray-200 px-3 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      moveIngredient(index, 1)
                    }
                    disabled={
                      index === ingredients.length - 1
                    }
                    aria-label="Move ingredient down"
                    className="rounded-lg bg-gray-200 px-3 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      removeIngredient(index)
                    }
                    aria-label="Remove ingredient"
                    className="rounded-lg bg-red-500 px-3 text-white hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* COOKING STEPS */}
            <div className="rounded-lg border border-[#468432] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">
                  Cooking Steps
                </h2>

                <button
                  type="button"
                  onClick={addStep}
                  className="font-semibold text-[#468432] hover:text-[#1A5C05]"
                >
                  + Add
                </button>
              </div>

              {steps.map((step, index) => (
                <div
                  key={`step-${index}`}
                  className="mb-3 flex gap-2"
                >
                  <input
                    value={step}
                    onChange={(event) =>
                      handleStepChange(
                        event.target.value,
                        index
                      )
                    }
                    placeholder={`Step ${index + 1}`}
                    rows={2}
                    className="min-w-0 flex-1 resize-y rounded-lg border p-3 outline-none focus:border-[#468432]"
                  />

                  <button
                    type="button"
                    onClick={() => moveStep(index, -1)}
                    disabled={index === 0}
                    aria-label="Move step up"
                    className="rounded-lg bg-gray-200 px-3 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↑
                  </button>

                  <button
                    type="button"
                    onClick={() => moveStep(index, 1)}
                    disabled={index === steps.length - 1}
                    aria-label="Move step down"
                    className="rounded-lg bg-gray-200 px-3 hover:bg-gray-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    ↓
                  </button>

                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    aria-label="Remove step"
                    className="rounded-lg bg-red-500 px-3 text-white hover:bg-red-600"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {/* ACTION BUTTONS */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
              <button
                type="button"
                onClick={(event) =>
                  handleSubmit(event, "pending")
                }
                disabled={Boolean(submittingStatus)}
                className="flex items-center justify-center gap-2 rounded-lg border border-[#FFA02E] bg-white px-6 py-3 font-semibold text-black transition hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60 md:col-span-2"
              >
                {submittingStatus === "pending" ? (
                  <>
                    <DotLottieReact
                      src="/loading.lottie"
                      autoplay
                      loop
                      className="h-6 w-6"
                    />
                    Saving...
                  </>
                ) : (
                  "Pending Recipe"
                )}
              </button>

              <button
                type="button"
                onClick={(event) =>
                  handleSubmit(event, "public")
                }
                disabled={Boolean(submittingStatus)}
                className="flex items-center justify-center gap-2 rounded-lg bg-[#FFA02E] px-6 py-3 font-semibold text-black transition hover:bg-[#e99120] disabled:cursor-not-allowed disabled:opacity-60 md:col-span-3"
              >
                {submittingStatus === "public" ? (
                  <>
                    <DotLottieReact
                      src="/loading.lottie"
                      autoplay
                      loop
                      className="h-6 w-6"
                    />
                    Publishing...
                  </>
                ) : (
                  "Public Recipe"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
