import {createRecipeService, getAllRecipesService, getRecipesByIdService, deleteRecipeService} from "../services/recipe.service.js"

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


// export const getRecipes = (req, res) => {
//   res.json([
//     {
//       id: 1,
//       name: "Fried Rice",
//       ingredients: ["rice", "egg", "garlic"],
//     },
//   ]);
// };