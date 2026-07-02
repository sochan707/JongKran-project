import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/test", authenticate, (req, res) => {
    res.json({
        message: "Middleware working",
        user: req.user
    });
});

export default router;