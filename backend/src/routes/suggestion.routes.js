import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { createSuggestionController, getAllSuggestionsController, getSuggestionByIdController, deleteSuggestionController } from "../controllers/suggestion.controller.js";

const router = express.Router();

router.post("/", authenticate, createSuggestionController);
router.get("/", authenticate, authorize(["Admin"]), getAllSuggestionsController);
router.get("/:id", authenticate, authorize(["Admin"]), getSuggestionByIdController);
router.delete("/:id", authenticate, authorize(["Admin"]), deleteSuggestionController);


export default router;