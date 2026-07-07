import express from "express";
// import { getRecipes } from "../controllers/recipe.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { createRecipeController } from "../controllers/recipe.controller.js";

const router = express.Router();
console.log("Recipe routes loaded");
router.post("/", authenticate, authorize(["Admin"]), createRecipeController);

export default router;