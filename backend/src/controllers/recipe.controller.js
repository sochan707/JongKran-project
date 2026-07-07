import {createRecipeService, getAllRecipesService, getRecipesByIdService} from "../services/recipe.service.js"

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

// export const getRecipes = (req, res) => {
//   res.json([
//     {
//       id: 1,
//       name: "Fried Rice",
//       ingredients: ["rice", "egg", "garlic"],
//     },
//   ]);
// };