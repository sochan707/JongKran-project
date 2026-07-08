import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { addHistoryController, getUserHistoryController } from "../controllers/history.controller.js";

const router = express.Router();

router.get("/", authenticate, getUserHistoryController);
router.post("/:recipeId", authenticate, addHistoryController);

export default router;