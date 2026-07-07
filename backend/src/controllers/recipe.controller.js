import {createRecipeService} from "../services/recipe.service.js"

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

// export const getRecipes = (req, res) => {
//   res.json([
//     {
//       id: 1,
//       name: "Fried Rice",
//       ingredients: ["rice", "egg", "garlic"],
//     },
//   ]);
// };