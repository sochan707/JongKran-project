import express from "express";
import "dotenv/config";
import { fileURLToPath } from "node:url";
import prisma from "./src/prismaClient.js";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Database testing app is running",
    endpoints: {
      connection: "GET /health",
      retrieveAll: "GET /ingredients",
      retrieveOne: "GET /ingredients/:id",
      create: "POST /ingredients",
      update: "PUT /ingredients/:id",
      delete: "DELETE /ingredients/:id",
    },
  });
});

app.get("/health", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      status: "ok",
      database: "connected",
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      database: "not connected",
      message: error.message,
    });
  }
});

app.get("/ingredients", async (req, res) => {
  try {
    const ingredients = await prisma.ingredient.findMany({
      orderBy: {
        ingredient_id: "asc",
      },
    });

    res.json(ingredients);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve ingredients",
      error: error.message,
    });
  }
});

app.get("/ingredients/:id", async (req, res) => {
  try {
    const ingredient = await prisma.ingredient.findUnique({
      where: {
        ingredient_id: Number(req.params.id),
      },
    });

    if (!ingredient) {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.json(ingredient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve ingredient",
      error: error.message,
    });
  }
});

app.post("/ingredients", async (req, res) => {
  const name = String(req.body.name || "").trim();

  if (!name) {
    return res.status(400).json({ message: "Ingredient name is required" });
  }

  try {
    const ingredient = await prisma.ingredient.create({
      data: {
        name,
      },
    });

    res.status(201).json(ingredient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to create ingredient",
      error: error.message,
    });
  }
});

app.put("/ingredients/:id", async (req, res) => {
  const id = Number(req.params.id);
  const name = String(req.body.name || "").trim();

  if (!name) {
    return res.status(400).json({ message: "Ingredient name is required" });
  }

  try {
    const ingredient = await prisma.ingredient.update({
      where: {
        ingredient_id: id,
      },
      data: {
        name,
      },
    });

    res.json(ingredient);
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(500).json({
      message: "Failed to update ingredient",
      error: error.message,
    });
  }
});

app.delete("/ingredients/:id", async (req, res) => {
  try {
    const ingredient = await prisma.ingredient.delete({
      where: {
        ingredient_id: Number(req.params.id),
      },
    });

    res.json({
      message: "Ingredient deleted",
      ingredient,
    });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Ingredient not found" });
    }

    res.status(500).json({
      message: "Failed to delete ingredient",
      error: error.message,
    });
  }
});

export const startTestingApp = () => {
  const server = app.listen(PORT, () => {
    console.log(`Testing app running on http://localhost:${PORT}`);
  });

  const shutdown = async () => {
    await prisma.$disconnect();
    server.close(() => {
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  return server;
};

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  startTestingApp();
}

console.log("PORT from env:", process.env.PORT);

export default app;
