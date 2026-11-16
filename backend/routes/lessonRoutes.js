import { Router } from "express";
import { getLesson, listLessons } from "../controllers/lessonController.js";

const router = Router();
router.get("/", listLessons);
router.get("/:id", getLesson);
export default router;
