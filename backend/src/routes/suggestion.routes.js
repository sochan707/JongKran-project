import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { createSuggestionController, getAllSuggestionsController, getSuggestionByIdController } from "../controllers/suggestion.controller.js";

const router = express.Router();

router.post("/", authenticate, createSuggestionController);
router.get("/", authenticate, authorize(["Admin"]), getAllSuggestionsController);
router.get("/:id", authenticate, authorize(["Admin"]), getSuggestionByIdController);


export default router;