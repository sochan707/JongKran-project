import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";

const router = express.Router();

router.get("/test", authenticate, (req, res) => {
    res.json({
        message: "Middleware working",
        user: req.user
    });
});
router.get("/admin-only",
  authenticate,
  authorize(["Admin"]),
  (req, res) => {
    res.json({
      message: "Admin access granted ✅"
    });
  }
);
router.get("/user-only",
  authenticate,
  authorize(["User", "Admin"]),
  (req, res) => {
    res.json({
      message: "User access granted ✅"
    });
  }
);

export default router;