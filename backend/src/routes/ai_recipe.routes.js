import express from "express";
import { generateAIRecipesController, aiRecipeActionController } from "../controllers/ai_recipe.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/", authenticate, generateAIRecipesController);
router.post("/:id/action", authenticate, aiRecipeActionController);

export default router;