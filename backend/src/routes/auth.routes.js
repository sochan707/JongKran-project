import express from "express";
import { register, login, refreshTokenController, logoutController, getProfile, updateProfile } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { uploadRecipeImage } from "../middleware/upload.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login)
router.post("/refresh", refreshTokenController);
router.post("/logout", authenticate, logoutController);
router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, uploadRecipeImage, updateProfile);

// ========================== TEST ===========================
router.post(
  "/admin/test",
  authenticate,
  authorize(["Admin"]),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

router.get("/test", authenticate, (req, res) => {
    res.json({
        message: "Middleware working",
        user: req.user
    });
});
// ============================================================

export default router;
