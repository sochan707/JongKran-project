import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorize } from "../middleware/rbac.middleware.js";
import { getAllAuditLogsController } from "../controllers/audit.controller.js";

const router = express.Router();

router.get("/", authenticate, authorize(["Admin"]), getAllAuditLogsController);

export default router;