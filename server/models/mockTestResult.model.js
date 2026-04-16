import mongoose from "mongoose";

const answerDetailSchema = new mongoose.Schema({
  questionId: { type: String, required: true },
  question: String,
  selectedOption: String,
  correctAnswer: String,
  isCorrect: { type: Boolean, default: false },
});

const mockTestResultSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      enum: ["DSA", "DBMS", "OS", "OOPS"],
      required: true,
    },
    score: { type: Number, required: true },
    totalQuestions: { type: Number, required: true },
    correctCount: { type: Number, required: true },
    wrongCount: { type: Number, required: true },
    timeLimitSeconds: Number,
    timeTakenSeconds: Number,
    details: [answerDetailSchema],
  },
  { timestamps: true }
);

const MockTestResult = mongoose.model("MockTestResult", mockTestResultSchema);

export default MockTestResult;
