import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { toggleFavoriteController } from "../controllers/favorite.controller.js";

const router = express.Router();

router.post("/:recipeId", authenticate, toggleFavoriteController);

export default router;