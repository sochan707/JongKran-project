import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import recipeRoutes from "./routes/recipe.routes.js";
import authRoutes from "./routes/auth.routes.js"
import testRoutes from "./routes/test.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";
import historyRoutes from "./routes/history.routes.js";
import recommendationRoutes from "./routes/recommendation.routes.js";
import aiRecipeRoutes from "./routes/ai_recipe.routes.js";
import suggestionRoutes from "./routes/suggestion.routes.js";
import auditRoutes from "./routes/audit.routes.js";
import uploadRoutes from "./routes/upload.route.js"

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "JongKran backend is running" });
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/ai-recipes", aiRecipeRoutes);
app.use("/api/suggestions", suggestionRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/uploads", uploadRoutes);

export default app;
