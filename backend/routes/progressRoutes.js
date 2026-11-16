import { Router } from "express";
import {
  getAttempt,
  getHistory,
  getProgress,
  getRecommendations,
} from "../controllers/progressController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.use(requireAuth);
router.get("/attempts/:id", getAttempt);
router.get("/:userId/history", getHistory);
router.get("/:userId/recommendations", getRecommendations);
router.get("/:userId", getProgress);
export default router;
