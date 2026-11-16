import mongoose from "mongoose";

const answerSchema = new mongoose.Schema(
  {
    questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
    selectedAnswer: { type: String, required: true },
    isCorrect: { type: Boolean, required: true },
    warningSigns: { type: [String], default: [] },
    explanation: { type: String, required: true },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    selectedAnswers: { type: [answerSchema], default: [] },
    correctAnswers: { type: Number, default: 0 },
    incorrectAnswers: { type: Number, default: 0 },
    totalQuestions: { type: Number, required: true },
    scorePercentage: { type: Number, default: 0 },
    missedWarningSigns: { type: [String], default: [] },
    completed: { type: Boolean, default: false },
    completionDate: { type: Date },
  },
  { timestamps: true }
);

resultSchema.index({ userId: 1, completionDate: -1 });

export default mongoose.model("Result", resultSchema);
