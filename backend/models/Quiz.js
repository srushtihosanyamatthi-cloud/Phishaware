import mongoose from "mongoose";

const questionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    senderEmail: { type: String, required: true, trim: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    suspiciousLink: { type: String, default: "" },
    options: { type: [String], required: true, validate: (v) => v.length >= 2 },
    correctAnswer: { type: String, required: true },
    explanation: { type: String, required: true },
    warningSigns: { type: [String], default: [] },
    isPhishing: { type: Boolean, required: true },
  },
  { timestamps: false }
);

const quizSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    questions: { type: [questionSchema], validate: (v) => v.length > 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Quiz", quizSchema);
