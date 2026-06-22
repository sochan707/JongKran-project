import express from "express";
import "dotenv/config";
import recipeRoutes from "./routes/recipe.routes.js";
import authRoutes from "./routes/auth.routes.js"
import recommendationRoutes from "./routes/recommendation.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "JongKran backend is running" });
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recommendations", recommendationRoutes);
export default app;
