import mongoose from "mongoose";

const sessionQuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: String, required: true },
  },
  { _id: false }
);

const mockQuizSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: { type: String, required: true },
    source: {
      type: String,
      enum: ["ai", "static"],
      default: "ai",
    },
    questions: {
      type: [sessionQuestionSchema],
      validate: [(v) => Array.isArray(v) && v.length > 0, "questions required"],
    },
  },
  { timestamps: true }
);

mockQuizSessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7200 });

const MockQuizSession = mongoose.model("MockQuizSession", mockQuizSessionSchema);

export default MockQuizSession;
