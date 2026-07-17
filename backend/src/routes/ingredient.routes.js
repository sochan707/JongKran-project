import express from "express";
import {authenticate} from "../middleware/auth.middleware.js"
import {authorize} from "../middleware/rbac.middleware.js";

const router = express.Router();



export default router;