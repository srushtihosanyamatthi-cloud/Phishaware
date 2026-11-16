import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";
import Lesson from "../models/Lesson.js";

function ensureOwnUser(req, res) {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    res.status(400).json({ message: "Invalid user id." });
    return false;
  }
  if (req.params.userId !== req.user._id.toString()) {
    res.status(403).json({ message: "You can only view your own progress." });
    return false;
  }
  return true;
}

export async function getProgress(req, res, next) {
  try {
    if (!ensureOwnUser(req, res)) return;
    const results = await Result.find({ userId: req.user._id, completed: true })
      .populate("quizId", "title")
      .sort({ completionDate: -1 });
    const correctAnswers = results.reduce((sum, result) => sum + result.correctAnswers, 0);
    const totalQuestions = results.reduce((sum, result) => sum + result.totalQuestions, 0);
    const missed = new Map();
    results.forEach((result) => result.missedWarningSigns.forEach((sign) => missed.set(sign, (missed.get(sign) || 0) + 1)));
    const commonMisses = [...missed.entries()]
      .map(([warningSign, count]) => ({ warningSign, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    const latest = results[0];

    res.json({
      stats: {
        quizzesAttempted: results.length,
        correctAnswers,
        totalQuestions,
        accuracy: totalQuestions ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
        latestScore: latest ? latest.scorePercentage : null,
      },
      commonlyMissed: commonMisses,
      recentHistory: results.slice(0, 5).map((result) => ({
        id: result._id,
        quizTitle: result.quizId?.title || "Phishing awareness quiz",
        scorePercentage: result.scorePercentage,
        correctAnswers: result.correctAnswers,
        totalQuestions: result.totalQuestions,
        completionDate: result.completionDate,
      })),
    });
  } catch (error) {
    next(error);
  }
}

export async function getHistory(req, res, next) {
  try {
    if (!ensureOwnUser(req, res)) return;
    const results = await Result.find({ userId: req.user._id, completed: true })
      .populate("quizId", "title")
      .sort({ completionDate: -1 })
      .limit(50);
    res.json({ history: results.map((result) => ({
      id: result._id,
      quizTitle: result.quizId?.title || "Phishing awareness quiz",
      scorePercentage: result.scorePercentage,
      correctAnswers: result.correctAnswers,
      incorrectAnswers: result.incorrectAnswers,
      totalQuestions: result.totalQuestions,
      missedWarningSigns: result.missedWarningSigns,
      completionDate: result.completionDate,
    })) });
  } catch (error) {
    next(error);
  }
}

export async function getRecommendations(req, res, next) {
  try {
    if (!ensureOwnUser(req, res)) return;
    const results = await Result.find({ userId: req.user._id, completed: true }).select("missedWarningSigns");
    const missedSigns = new Set(results.flatMap((result) => result.missedWarningSigns));
    const lessons = await Lesson.find().sort({ title: 1 });
    const recommendations = lessons
      .filter((lesson) => lesson.relatedWarningSigns.some((sign) => missedSigns.has(sign)))
      .map((lesson) => ({
        id: lesson._id,
        slug: lesson.slug,
        title: lesson.title,
        description: lesson.description,
        relatedWarningSigns: lesson.relatedWarningSigns.filter((sign) => missedSigns.has(sign)),
      }));
    res.json({ recommendations });
  } catch (error) {
    next(error);
  }
}

export async function getAttempt(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid attempt id." });
    }
    const result = await Result.findOne({ _id: req.params.id, userId: req.user._id }).populate("quizId", "title");
    if (!result) return res.status(404).json({ message: "Quiz attempt not found." });
    const quiz = await Quiz.findById(result.quizId).select("questions");
    const answers = result.selectedAnswers.map((answer) => {
      const question = quiz.questions.id(answer.questionId);
      return {
        questionId: answer.questionId,
        question: question?.question,
        senderEmail: question?.senderEmail,
        subject: question?.subject,
        message: question?.message,
        suspiciousLink: question?.suspiciousLink,
        selectedAnswer: answer.selectedAnswer,
        correctAnswer: question?.correctAnswer,
        isCorrect: answer.isCorrect,
        explanation: answer.explanation,
        warningSigns: question?.warningSigns || [],
        missedWarningSigns: answer.warningSigns,
      };
    });
    res.json({
      result: {
        id: result._id,
        quizTitle: result.quizId.title,
        completed: result.completed,
        totalQuestions: result.totalQuestions,
        correctAnswers: result.correctAnswers,
        incorrectAnswers: result.incorrectAnswers,
        scorePercentage: result.scorePercentage,
        missedWarningSigns: result.missedWarningSigns,
        completionDate: result.completionDate,
        answers,
      },
    });
  } catch (error) {
    next(error);
  }
}
