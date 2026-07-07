import express from "express";
// import { getRecipes } from "../controllers/recipe.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { createRecipeController, getAllRecipesController } from "../controllers/recipe.controller.js";

const router = express.Router();

router.post("/", authenticate, authorize(["Admin"]), createRecipeController);
router.get("/", getAllRecipesController)

export default router;