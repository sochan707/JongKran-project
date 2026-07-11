import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createSuggestionController } from "../controllers/suggestion.controller.js";

const router = express.Router();

router.post("/", authenticate, createSuggestionController);

export default router;