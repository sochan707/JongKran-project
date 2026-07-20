import express from "express";
import { generateAIRecipesController, aiRecipeActionController, getAIRecipeForUserController, getAIRecipeStatsController, getPendingAIRecipeByIdController, getPendingAIRecipesController, reviewAIRecipeController } from "../controllers/ai_recipe.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.post("/", authenticate, generateAIRecipesController);
router.get("/admin/stats", authenticate, authorize(["Admin"]), getAIRecipeStatsController);
router.get("/pending", authenticate, authorize(["Admin"]), getPendingAIRecipesController);
router.get("/pending/:id", authenticate, authorize(["Admin"]), getPendingAIRecipeByIdController);
router.get("/:id", authenticate, getAIRecipeForUserController);
router.patch("/:id/review", authenticate, authorize(["Admin"]), reviewAIRecipeController);
router.post("/:id/action", authenticate, aiRecipeActionController);

export default router;
