import express from "express";
import { recommendRecipes } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.post("/", recommendRecipes);

export default router;
