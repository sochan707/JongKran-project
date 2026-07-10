import express from "express";
import { findMatchingRecipesController } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.post("/", findMatchingRecipesController);

export default router;