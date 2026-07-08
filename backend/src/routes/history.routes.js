import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { addHistoryController } from "../controllers/history.controller.js";

const router = express.Router();

router.post("/:recipeId", authenticate, addHistoryController);

export default router;