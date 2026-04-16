import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { askAi } from "../services/openRouter.service.js";
import MockTestResult from "../models/mockTestResult.model.js";
import MockQuizSession from "../models/mockQuizSession.model.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const VALID_CATEGORIES = ["DSA", "DBMS", "OS", "OOPS"];

const CATEGORY_LABELS = {
  DSA: "Data Structures and Algorithms",
  DBMS: "Database Management Systems (SQL, transactions, normalization)",
  OS: "Operating Systems (processes, memory, scheduling, concurrency)",
  OOPS: "Object-Oriented Programming (encapsulation, inheritance, polymorphism)",
};

const QUESTION_COUNT = 8;

const loadQuestionBank = () => {
  const raw = readFileSync(
    join(__dirname, "../data/mockQuestions.json"),
    "utf8"
  );
  return JSON.parse(raw);
};

const stripForClient = (q) => ({
  id: q.id,
  question: q.question,
  options: q.options,
});

function parseAiJsonArray(content) {
  let text = (content || "").trim();
  if (text.startsWith("```")) {
    const firstLineBreak = text.indexOf("\n");
    text = text.slice(firstLineBreak + 1);
    const fenceEnd = text.lastIndexOf("```");
    if (fenceEnd !== -1) text = text.slice(0, fenceEnd);
  }
  const parsed = JSON.parse(text.trim());
  return parsed;
}

function normalizeMcq(raw, category, index) {
  const question =
    typeof raw.question === "string" ? raw.question.trim() : "";
  let options = Array.isArray(raw.options) ? raw.options.map(String) : [];
  options = [...new Set(options.map((o) => o.trim()))].filter(Boolean);
  let correctAnswer =
    typeof raw.correctAnswer === "string"
      ? raw.correctAnswer.trim()
      : String(raw.correctAnswer || "").trim();

  if (options.length !== 4) {
    throw new Error("Each question must have exactly 4 options.");
  }
  const match = options.find(
    (o) => o.toLowerCase() === correctAnswer.toLowerCase()
  );
  if (!match) {
    throw new Error("correctAnswer must match one of the four options.");
  }
  correctAnswer = match;

  return {
    id: `${category.toLowerCase()}-ai-${index + 1}`,
    question,
    options,
    correctAnswer,
  };
}

async function generateQuestionsWithAi(category) {
  const label = CATEGORY_LABELS[category] || category;
  const messages = [
    {
      role: "system",
      content: `You write technical interview multiple-choice questions.
Return ONLY a valid JSON array (no markdown, no code fences, no commentary) of exactly ${QUESTION_COUNT} objects.
Each object must have:
- "question": string (one clear question)
- "options": array of exactly 4 distinct, non-empty strings
- "correctAnswer": string that must exactly match one of the four strings in "options" (same spelling and casing as that option)`,
    },
    {
      role: "user",
      content: `Generate ${QUESTION_COUNT} MCQs for: ${label}
Category code: ${category}
Mix difficulty from easy to medium. No duplicate questions.`,
    },
  ];

  const raw = await askAi(messages);
  const arr = parseAiJsonArray(raw);
  if (!Array.isArray(arr) || arr.length < QUESTION_COUNT) {
    throw new Error("AI did not return enough questions.");
  }

  return arr
    .slice(0, QUESTION_COUNT)
    .map((q, i) => normalizeMcq(q, category, i));
}

function getStaticQuestions(category) {
  const bank = loadQuestionBank();
  const list = bank[category] || [];
  if (!list.length) return null;
  return list.slice(0, QUESTION_COUNT);
}

/**
 * POST /api/mock-test/start { category }
 * Generates questions with AI (falls back to static JSON), stores session.
 */
export const startMockTest = async (req, res) => {
  try {
    const category = (req.body.category || "").trim().toUpperCase();
    if (!VALID_CATEGORIES.includes(category)) {
      return res.status(400).json({
        message: "Invalid category. Use DSA, DBMS, OS, or OOPS.",
      });
    }

    let questions;
    let source = "ai";

    try {
      questions = await generateQuestionsWithAi(category);
    } catch (aiErr) {
      console.warn("AI quiz generation failed, using static bank:", aiErr.message);
      const staticList = getStaticQuestions(category);
      if (!staticList) {
        return res.status(500).json({
          message: "Could not generate questions. Try again later.",
        });
      }
      questions = staticList;
      source = "static";
    } 

    const session = await MockQuizSession.create({
      userId: req.userId,
      category,
      source,
      questions,
    });

    return res.json({
      quizId: session._id,
      category,
      source,
      total: questions.length,
      questions: questions.map(stripForClient),
    });
  } catch (error) {
    console.error("startMockTest:", error);
    return res.status(500).json({ message: "Failed to start mock test." });
  }
};

/**
 * POST /api/mock-test/submit
 * body: { quizId, answers: [{ questionId, selectedOption }], timeTakenSeconds? }
 */
export const submitMockTest = async (req, res) => {
  try {
    const { quizId, answers: rawAnswers, timeTakenSeconds } = req.body;
    const answers = Array.isArray(rawAnswers) ? rawAnswers : [];

    if (!quizId) {
      return res.status(400).json({ message: "quizId is required." });
    }

    const session = await MockQuizSession.findOne({
      _id: quizId,
      userId: req.userId,
    });

    if (!session) {
      return res.status(404).json({
        message: "Quiz session expired or not found. Start a new test.",
      });
    }

    const list = session.questions;
    const category = session.category;
    const answerById = new Map(
      answers.map((a) => [a.questionId, (a.selectedOption ?? "").trim()])
    );

    let correctCount = 0;
    const details = [];

    for (const q of list) {
      const selected = answerById.get(q.id) || "";
      const isCorrect = selected === q.correctAnswer.trim();
      if (isCorrect) correctCount++;

      details.push({
        questionId: q.id,
        question: q.question,
        options: q.options,
        selectedOption: selected,
        correctAnswer: q.correctAnswer,
        isCorrect,
      });
    }

    const totalQuestions = list.length;
    const wrongCount = totalQuestions - correctCount;

    const resultDoc = await MockTestResult.create({
      userId: req.userId,
      category,
      score: correctCount,
      totalQuestions,
      correctCount,
      wrongCount,
      timeLimitSeconds: undefined,
      timeTakenSeconds:
        typeof timeTakenSeconds === "number" ? timeTakenSeconds : undefined,
      details,
    });

    await MockQuizSession.deleteOne({ _id: session._id });

    return res.json({
      mockTestId: resultDoc._id,
      category,
      score: correctCount,
      totalQuestions,
      correctCount,
      wrongCount,
      results: details,
    });
  } catch (error) {
    console.error("submitMockTest:", error);
    return res.status(500).json({ message: "Failed to submit mock test." });
  }
};

/**
 * GET /api/mock-test/history
 */
export const getMockTestHistory = async (req, res) => {
  try {
    const rows = await MockTestResult.find({ userId: req.userId })
      .sort({ createdAt: -1 })
      .limit(20)
      .select(
        "category score totalQuestions correctCount wrongCount createdAt"
      );

    return res.json({ history: rows });
  } catch (error) {
    console.error("getMockTestHistory:", error);
    return res.status(500).json({ message: "Failed to load mock test history." });
  }
};
