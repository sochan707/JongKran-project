import express from "express";
import { register, login , refreshToken, logoutController} from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login)
router.post("/refresh", refreshToken);
router.post("/logout", authenticate, logoutController);

// router.post("/recipes", authenticate, authorize(["Admin"]), createRecipe);
// router.post("/recipes", authenticate, authorize(["Admin"]), updateRecipe);
// router.post("/recipes", authenticate, authorize(["Admin"]), deleteRecipe);
// router.get("/recipes", authenticate, authorize(["Admin"]), getRecipe);

// router.get("/favorites", authenticate, authorize(["User", "Admin"]), getFavorites);
// router.post("/favorites", authenticate, authorize(["User", "Admin"]), addFavorites);
// router.get("/favorites", authenticate, authorize(["User", "Admin"]), removeFavorites);


// ========================== TEST ===========================
router.post(
  "/admin/test",
  authenticate,
  authorize(["Admin"]),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);
// ============================================================

export default router;
