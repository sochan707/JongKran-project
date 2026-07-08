import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { toggleFavoriteController, getUserFavoritesController } from "../controllers/favorite.controller.js";

const router = express.Router();

router.get("/", authenticate, getUserFavoritesController);
router.post("/:recipeId", authenticate, toggleFavoriteController);

export default router;