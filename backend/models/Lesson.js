import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    relatedWarningSigns: { type: [String], default: [] },
    content: { type: [String], default: [] },
    icon: { type: String, default: "book" },
  },
  { timestamps: true }
);

export default mongoose.model("Lesson", lessonSchema);
