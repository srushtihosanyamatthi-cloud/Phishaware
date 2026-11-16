import mongoose from "mongoose";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

function publicQuiz(quiz, includeAnswers = false) {
  const data = quiz.toObject();
  if (!includeAnswers) {
    data.questions = data.questions.map(({ correctAnswer, explanation, warningSigns, isPhishing, ...question }) => question);
  }
  return data;
}

export async function listQuizzes(req, res, next) {
  try {
    const quizzes = await Quiz.find().select("slug title description questions._id").sort({ createdAt: 1 });
    res.json({ quizzes: quizzes.map((quiz) => ({
      id: quiz._id,
      slug: quiz.slug,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
    })) });
  } catch (error) {
    next(error);
  }
}

export async function getQuiz(req, res, next) {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Invalid quiz id." });
    }
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });
    res.json({ quiz: publicQuiz(quiz) });
  } catch (error) {
    next(error);
  }
}

export async function submitAnswer(req, res, next) {
  try {
    const { quizId, attemptId, questionId, selectedAnswer } = req.body;
    if (!mongoose.isValidObjectId(quizId) || !mongoose.isValidObjectId(questionId)) {
      return res.status(400).json({ message: "A valid quiz and question are required." });
    }
    if (attemptId !== undefined && !mongoose.isValidObjectId(attemptId)) {
      return res.status(400).json({ message: "Invalid attempt id." });
    }
    if (typeof selectedAnswer !== "string" || selectedAnswer.length > 100) {
      return res.status(400).json({ message: "Choose one of the available answer options." });
    }

    const quiz = await Quiz.findById(quizId);
    if (!quiz) return res.status(404).json({ message: "Quiz not found." });
    const question = quiz.questions.id(questionId);
    if (!question) return res.status(404).json({ message: "Question not found in this quiz." });
    if (!question.options.includes(selectedAnswer)) {
      return res.status(400).json({ message: "Choose one of the available answer options." });
    }

    let result;
    if (attemptId) {
      result = await Result.findOne({ _id: attemptId, userId: req.user._id, quizId, completed: false });
      if (!result) return res.status(404).json({ message: "Quiz attempt not found or already completed." });
    } else {
      result = new Result({
        userId: req.user._id,
        quizId,
        totalQuestions: quiz.questions.length,
      });
    }

    const isCorrect = selectedAnswer === question.correctAnswer;
    const answer = {
      questionId: question._id,
      selectedAnswer,
      isCorrect,
      warningSigns: isCorrect ? [] : question.warningSigns,
      explanation: question.explanation,
    };
    const existingIndex = result.selectedAnswers.findIndex((entry) => entry.questionId.equals(question._id));
    if (existingIndex >= 0) result.selectedAnswers[existingIndex] = answer;
    else result.selectedAnswers.push(answer);

    result.correctAnswers = result.selectedAnswers.filter((entry) => entry.isCorrect).length;
    result.incorrectAnswers = result.selectedAnswers.length - result.correctAnswers;
    result.scorePercentage = Math.round((result.correctAnswers / result.totalQuestions) * 100);
    result.missedWarningSigns = [...new Set(result.selectedAnswers.flatMap((entry) => entry.warningSigns))];
    result.completed = result.selectedAnswers.length === quiz.questions.length;
    if (result.completed) result.completionDate = new Date();
    await result.save();

    res.json({
      attemptId: result._id,
      feedback: {
        questionId: question._id,
        selectedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        explanation: question.explanation,
        warningSigns: question.warningSigns,
        missedWarningSigns: answer.warningSigns,
      },
      progress: {
        answered: result.selectedAnswers.length,
        total: result.totalQuestions,
        completed: result.completed,
      },
    });
  } catch (error) {
    next(error);
  }
}
