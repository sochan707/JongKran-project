import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { optionalAuthenticate } from "../middleware/optionalAuth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { createRecipeController, getAllRecipesController, getRecipeByIdController, deleteRecipeController, updateRecipeController } from "../controllers/recipe.controller.js";
import { addIngredientToRecipeController, bulkAddIngredientsToRecipeController, updateRecipeIngredientController, removeRecipeIngredientController } from "../controllers/ingredient.controller.js";
import { addRecipeStepController, bulkAddRecipeStepsController, updateRecipeStepController, removeRecipeStepController, reorderRecipeStepsController } from "../controllers/step.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize(["Admin"]), createRecipeController);
router.get("/", getAllRecipesController);
router.get("/:id", optionalAuthenticate, getRecipeByIdController);

router.post("/:id/ingredients", authenticate, authorize(["Admin"]), addIngredientToRecipeController);
router.post("/:id/ingredients/bulk", authenticate, authorize(["Admin"]), bulkAddIngredientsToRecipeController);
router.patch("/:recipeId/ingredients/:ingredientId",authenticate, authorize(["Admin"]),updateRecipeIngredientController);
router.delete("/:recipeId/ingredients/:ingredientId", authenticate, authorize(["Admin"]), removeRecipeIngredientController);

router.post("/:id/steps", authenticate, authorize(["Admin"]), addRecipeStepController);
router.post("/:id/steps/bulk", authenticate, authorize(["Admin"]), bulkAddRecipeStepsController);
router.patch("/:recipeId/steps/reorder", authenticate, authorize(["Admin"]), reorderRecipeStepsController);
router.patch("/:recipeId/steps/:stepNumber", authenticate, authorize(["Admin"]), updateRecipeStepController);
router.delete("/:recipeId/steps/:stepNumber", authenticate, authorize(["Admin"]),removeRecipeStepController);

router.patch("/:id", authenticate, authorize(["Admin"]), updateRecipeController);
router.delete("/:id", authenticate, authorize(["Admin"]), deleteRecipeController);

export default router;
