import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { uploadRecipeImage } from "../middleware/upload.middleware.js";
import { uploadRecipeImageController } from "../controllers/upload.controller.js";

const router = express.Router();

router.post("/recipe-image", authenticate, authorize(["Admin"]), uploadRecipeImage, uploadRecipeImageController);

export default router;