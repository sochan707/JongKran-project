import {createRecipeService, getAllRecipesService, getRecipesByIdService, deleteRecipeService, updateRecipeService} from "../services/recipe.service.js"

export const createRecipeController = async (req, res) => {
  try {
    const adminId = req.user.userId;
    const recipe = await createRecipeService(req.body, adminId);

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully! ＼( ᵔ ω ᵔ )／",
      data: recipe,
    });

  } catch(err){
    return res.status(400).json({
      success: false,
      message: "Invalid Input! (; •́ᆺ•̀)",
    });
  }
};

export const getAllRecipesController = async (req, res) => {
  try {
    const recipes = await getAllRecipesService();

    return res.status(200).json({
      success: true,
      data: recipes,
    });

  } catch(err){
    return res.status(500).json({
      success: false,
      message: err.message,
    })
  }
};

export const getRecipeByIdController = async (req, res) => {
  try{
    const {id} = req.params;
    const isLoggedIn = !!req.user;
    const recipe = await getRecipesByIdService(id,isLoggedIn);

    return res.status(200).json({
      success: true,
      data: recipe,
    });

  } catch(err){
    return res.status(404).json({
      success: false,
      message: err.message,
    });
  }
};

export const deleteRecipeController = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const adminId = req.user.userId;

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    const deletedRecipe = await deleteRecipeService(
      recipeId,
      adminId
    );

    return res.status(200).json({
      success: true,
      message: "Recipe deleted successfully! ᕕ( ᐛ )ᕗ",
      data: deletedRecipe,
    });
  } catch (error) {
    console.error("DELETE RECIPE ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to delete recipe! o(╥﹏╥)o",
    });
  }
};

export const updateRecipeController = async (req, res) => {
  try {
    const recipeId = Number(req.params.id);
    const adminId = req.user.userId;

    if (!Number.isInteger(recipeId) || recipeId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Recipe ID must be a valid number! ʕ•̀ᆺ•́ʔ",
      });
    }

    const {title, description, image_url, difficulty, prep_time, cook_time, servings} = req.body;

    const updateData = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: "Title must be valid text! ʕ•̀ᆺ•́ʔ",
        });
      }

      updateData.title = title.trim();
    }

    if (description !== undefined) {
      updateData.description =
        description === null ? null : String(description).trim();
    }

    if (image_url !== undefined) {
      updateData.image_url =
        image_url === null ? null : String(image_url).trim();
    }

    if (difficulty !== undefined) {
      const allowedDifficulties = ["easy", "medium", "hard"];

      if (!allowedDifficulties.includes(difficulty)) {
        return res.status(400).json({
          success: false,
          message: "Difficulty must be easy, medium, or hard! ʕ•̀ᆺ•́ʔ",
        });
      }

      updateData.difficulty = difficulty;
    }

    if (prep_time !== undefined) {
      const prepTime = Number(prep_time);

      if (!Number.isInteger(prepTime) || prepTime < 0) {
        return res.status(400).json({
          success: false,
          message: "Prep time must be a non-negative integer! ʕ•̀ᆺ•́ʔ",
        });
      }

      updateData.prep_time = prepTime;
    }

    if (cook_time !== undefined) {
      const cookTime = Number(cook_time);

      if (!Number.isInteger(cookTime) || cookTime < 0) {
        return res.status(400).json({
          success: false,
          message: "Cook time must be a non-negative integer! ʕ•̀ᆺ•́ʔ",
        });
      }

      updateData.cook_time = cookTime;
    }

    if (servings !== undefined) {
      const servingCount = Number(servings);

      if (!Number.isInteger(servingCount) || servingCount <= 0) {
        return res.status(400).json({
          success: false,
          message: "Servings must be greater than 0! ʕ•̀ᆺ•́ʔ",
        });
      }

      updateData.servings = servingCount;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Provide at least one field to update! ʕ•̀ᆺ•́ʔ",
      });
    }

    const updatedRecipe = await updateRecipeService(recipeId, updateData, adminId);

    return res.status(200).json({
      success: true,
      message: "Recipe updated successfully! ᕕ( ᐛ )ᕗ",
      data: updatedRecipe,
    });
  } catch (error) {
    console.error("UPDATE RECIPE ERROR:", error);

    return res.status(error.statusCode || 500).json({
      success: false,
      message:
        error.message ||
        "Failed to update recipe! o(╥﹏╥)o",
    });
  }
};
// export const getRecipes = (req, res) => {
//   res.json([
//     {
//       id: 1,
//       name: "Fried Rice",
//       ingredients: ["rice", "egg", "garlic"],
//     },
//   ]);
// };