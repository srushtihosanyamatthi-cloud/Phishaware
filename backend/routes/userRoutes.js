import { Router } from "express";
import { getUser, login, register } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.post("/register", register);
router.post("/login", login);
router.get("/:id", requireAuth, getUser);
export default router;
