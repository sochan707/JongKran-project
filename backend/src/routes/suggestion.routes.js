import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { createSuggestionController, getAllSuggestionsController } from "../controllers/suggestion.controller.js";

const router = express.Router();

router.post("/", authenticate, createSuggestionController);
router.get("/", authenticate, authorize(["Admin"]), getAllSuggestionsController);

export default router;