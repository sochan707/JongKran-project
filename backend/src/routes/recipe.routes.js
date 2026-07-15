import express from "express";
// import { getRecipes } from "../controllers/recipe.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { createRecipeController, getAllRecipesController, getRecipeByIdController, deleteRecipeController } from "../controllers/recipe.controller.js";
import { optionalAuthenticate } from "../middleware/optionalAuth.middleware.js";
import { addIngredientToRecipeController } from "../controllers/ingredient.controller.js";
import { addRecipeStepController } from "../controllers/step.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize(["Admin"]), createRecipeController);
router.get("/", getAllRecipesController);
router.get("/:id", optionalAuthenticate, getRecipeByIdController);
router.post("/:id/ingredients", authenticate, authorize(["Admin"]), addIngredientToRecipeController);
router.post("/:id/steps", authenticate, authorize(["Admin"]), addRecipeStepController);
router.delete("/:id", authenticate, authorize(["Admin"]), deleteRecipeController);


export default router;