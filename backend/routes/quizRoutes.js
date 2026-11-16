import { Router } from "express";
import { getQuiz, listQuizzes, submitAnswer } from "../controllers/quizController.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();
router.get("/", listQuizzes);
router.get("/:id", getQuiz);
router.post("/submit", requireAuth, submitAnswer);
export default router;
