import express from "express";
import recipeRoutes from "./routes/recipe.routes.js";
import authRoutes from "./routes/auth.routes.js"

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "JongKran backend is running" });
});

app.use("/api/recipes", recipeRoutes);
app.use("/api/auth", authRoutes);
export default app;