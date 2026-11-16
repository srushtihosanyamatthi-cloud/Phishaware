import mongoose from "mongoose";
import Lesson from "../models/Lesson.js";

export async function listLessons(req, res, next) {
  try {
    const lessons = await Lesson.find().select("slug title description relatedWarningSigns icon").sort({ title: 1 });
    res.json({ lessons });
  } catch (error) {
    next(error);
  }
}

export async function getLesson(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid lesson id." });
    }
    const lesson = await Lesson.findById(req.params.id);
    if (!lesson) return res.status(404).json({ message: "Lesson not found." });
    res.json({ lesson });
  } catch (error) {
    next(error);
  }
}
