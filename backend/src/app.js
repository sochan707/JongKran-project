import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import recipeRoutes from "./routes/recipe.routes.js";
import authRoutes from "./routes/auth.routes.js"
import recommendationRoutes from "./routes/recommendation.routes.js";
import testRoutes from "./routes/test.routes.js";
import favoriteRoutes from "./routes/favorite.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({ message: "JongKran backend is running" });
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/recommendations", recommendationRoutes);
app.use("/api/test", testRoutes);
app.use("/api/favorites", favoriteRoutes);

export default app;
