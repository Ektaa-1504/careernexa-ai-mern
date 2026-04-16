import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import MainLayout from "../components/MainLayout";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";
import {
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaCode,
  FaDatabase,
  FaServer,
  FaCube,
} from "react-icons/fa";
import { HiSparkles } from "react-icons/hi";
import { useSelector } from "react-redux";
import AuthModel from "../components/AuthModel";

const TEST_DURATION_SEC = 15 * 60;

const ICON_GRADIENT = "from-emerald-600 to-teal-500";

const CATEGORIES = [
  {
    id: "DSA",
    title: "DSA",
    blurb: "Arrays, trees, graphs, complexity — core CS problem solving.",
    Icon: FaCode,
  },
  {
    id: "DBMS",
    title: "DBMS",
    blurb: "SQL, normalization, transactions, and indexing.",
    Icon: FaDatabase,
  },
  {
    id: "OS",
    title: "Operating Systems",
    blurb: "Processes, memory, scheduling, deadlocks, and virtualization.",
    Icon: FaServer,
  },
  {
    id: "OOPS",
    title: "OOP",
    blurb: "Classes, inheritance, polymorphism, SOLID, and design.",
    Icon: FaCube,
  },
];

function MockTestPage() {
  const navigate = useNavigate();
  const { userData } = useSelector((s) => s.user);
  const [showAuth, setShowAuth] = useState(false);
  const [step, setStep] = useState("category");
  const [category, setCategory] = useState(null);
  const [quizId, setQuizId] = useState(null);
  const [questionSource, setQuestionSource] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(TEST_DURATION_SEC);
  const [loading, setLoading] = useState(false);
  const [loadingCat, setLoadingCat] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [autoSubmitDone, setAutoSubmitDone] = useState(false);

  const selectOption = (questionId, option) => {
    setAnswers((prev) => ({ ...prev, [questionId]: option }));
  };

  const startTest = async (cat) => {
    setLoading(true);
    setLoadingCat(cat);
    setError("");
    try {
      const res = await axios.post(
        `${ServerUrl}/api/mock-test/start`,
        { category: cat },
        { withCredentials: true }
      );
      setQuestions(res.data.questions || []);
      setCategory(res.data.category);
      setQuizId(res.data.quizId);
      setQuestionSource(res.data.source || "ai");
      setAnswers({});
      setTimeLeft(TEST_DURATION_SEC);
      setAutoSubmitDone(false);
      setStep("exam");
    } catch (e) {
      console.error(e);
      setError(
        e?.response?.data?.message || "Could not start test. Try signing in again."
      );
    } finally {
      setLoading(false);
      setLoadingCat(null);
    }
  };

  const handlePickCategory = (cat) => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    setCategory(cat);
    startTest(cat);
  };

  const submitTest = useCallback(async () => {
    if (!quizId || !questions.length || submitting) return;
    setAutoSubmitDone(true);
    setSubmitting(true);
    const answerList = questions.map((q) => ({
      questionId: q.id,
      selectedOption: answers[q.id] || "",
    }));
    const timeTaken = TEST_DURATION_SEC - timeLeft;
    try {
      const res = await axios.post(
        `${ServerUrl}/api/mock-test/submit`,
        {
          quizId,
          answers: answerList,
          timeTakenSeconds: timeTaken,
        },
        { withCredentials: true }
      );
      setResult(res.data);
      setStep("result");
    } catch (e) {
      console.error(e);
      setAutoSubmitDone(false);
      setError(e?.response?.data?.message || "Submit failed.");
    } finally {
      setSubmitting(false);
    }
  }, [quizId, questions, answers, timeLeft, submitting]);

  useEffect(() => {
    if (step !== "exam" || submitting) return;
    const id = setInterval(() => {
      setTimeLeft((s) => {
        if (s <= 1) {
          if (!autoSubmitDone) {
            setAutoSubmitDone(true);
            setTimeout(() => submitTest(), 0);
          }
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [step, submitting, submitTest, autoSubmitDone]);

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const resetFlow = () => {
    setStep("category");
    setCategory(null);
    setQuizId(null);
    setQuestionSource(null);
    setQuestions([]);
    setAnswers({});
    setResult(null);
    setTimeLeft(TEST_DURATION_SEC);
    setError("");
    setAutoSubmitDone(false);
  };

  const pct =
    result && result.totalQuestions
      ? Math.round((result.correctCount / result.totalQuestions) * 100)
      : 0;

  return (
    <MainLayout>
      <PageShell className="flex-1 flex flex-col">
        <div className="mx-auto w-full max-w-3xl px-4 sm:px-6 py-8 lg:py-10">
          <button
            type="button"
            onClick={() => (step === "category" ? navigate("/") : resetFlow())}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition font-medium"
          >
            <FaArrowLeft />
            {step === "category" ? "Back to Home" : "Leave & pick another subject"}
          </button>

          <AnimatePresence mode="wait">
            {step === "category" && (
              <motion.div
                key="category-step"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-center mb-10">
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 text-xs font-medium mb-4 shadow-sm">
                    <HiSparkles className="text-emerald-600" />
                    AI-powered quiz · 8 questions · 15 minutes
                  </div>
                  <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
                    Mock Test Lab
                  </h1>
                  <p className="text-sm text-gray-500 mt-3 max-w-lg mx-auto leading-relaxed">
                    Pick a track. We generate a fresh MCQ set with AI (with offline
                    backup if needed). Select answers, beat the timer, review with
                    color-coded solutions.
                  </p>
                </div>

                {error && (
                  <div className="mb-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm text-center">
                    {error}
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {CATEGORIES.map((c, i) => (
                    <motion.button
                      key={c.id}
                      type="button"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      whileHover={{ y: -5, scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handlePickCategory(c.id)}
                      disabled={loading}
                      className="text-left bg-white rounded-2xl shadow-lg border border-gray-200 p-6 hover:border-emerald-200 disabled:opacity-50 transition-all duration-300"
                    >
                      <div
                        className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${ICON_GRADIENT} text-white shadow-md mb-4`}
                      >
                        <c.Icon className="w-6 h-6" />
                      </div>
                      <h2 className="text-lg font-semibold text-gray-800 mb-1">{c.title}</h2>
                      <p className="text-sm text-gray-500 leading-relaxed">{c.blurb}</p>
                      {loading && loadingCat === c.id && (
                        <p className="mt-4 text-emerald-600 text-sm flex items-center gap-2">
                          <span className="inline-block w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                          Generating questions…
                        </p>
                      )}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}

            {step === "exam" && (
              <motion.div
                key="exam-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                {error && (
                  <div className="mb-4 rounded-2xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
                    {error}
                  </div>
                )}

                <div className="sticky top-24 z-10 mb-8 rounded-2xl border border-gray-200 bg-white/90 backdrop-blur-md px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-lg">
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="flex items-center gap-2 text-emerald-700 font-mono text-lg font-semibold tabular-nums">
                      <FaClock className="text-emerald-600" />
                      {formatTime(Math.max(0, timeLeft))}
                    </div>
                    <span className="text-gray-300 hidden sm:inline">|</span>
                    <span className="text-gray-800 text-sm font-semibold">
                      {CATEGORIES.find((x) => x.id === category)?.title || category}
                    </span>
                    {questionSource === "ai" && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <HiSparkles className="text-[10px]" /> AI
                      </span>
                    )}
                  </div>
                  <motion.button
                    type="button"
                    whileHover={!submitting ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!submitting ? { scale: 0.98, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    className="!py-2 !px-4 !text-sm inline-flex items-center justify-center font-semibold bg-gradient-to-r from-emerald-600 to-teal-500 text-white rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    disabled={submitting}
                    onClick={() => {
                      if (
                        window.confirm(
                          "Submit the test? You won’t be able to change answers."
                        )
                      )
                        submitTest();
                    }}
                  >
                    {submitting ? "Submitting…" : "Submit"}
                  </motion.button>
                </div>

                <div className="space-y-5">
                  {questions.map((q, idx) => (
                    <motion.div
                      key={q.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 shadow-md"
                    >
                      <div className="flex items-center justify-between gap-2 mb-4">
                        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                          Question {idx + 1} / {questions.length}
                        </span>
                      </div>
                      <p className="text-gray-800 font-medium text-base md:text-lg leading-relaxed mb-5">
                        {q.question}
                      </p>
                      <div className="grid sm:grid-cols-2 gap-2.5">
                        {q.options.map((opt) => {
                          const selected = answers[q.id] === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => selectOption(q.id, opt)}
                              className={`text-left px-4 py-3.5 rounded-xl border-2 text-sm transition-all ${
                                selected
                                  ? "border-emerald-500 bg-emerald-50 text-emerald-900 shadow-sm"
                                  : "border-gray-200 bg-gray-50 text-gray-800 hover:border-emerald-200"
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  ))}
                </div>

                <div className="mt-10 flex justify-center pb-8">
                  <motion.button
                    type="button"
                    whileHover={!submitting ? { scale: 1.02, y: -1 } : {}}
                    whileTap={!submitting ? { scale: 0.98, y: 0 } : {}}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    disabled={submitting}
                    onClick={() => {
                      if (window.confirm("Submit the test now?")) submitTest();
                    }}
                    className="inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {submitting ? "Submitting…" : "Submit test"}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {step === "result" && result && (
              <motion.div
                key="result-step"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center shadow-xl border-emerald-100 bg-gradient-to-br from-white to-emerald-50/30">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight mb-2">
                    Test complete
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">Here’s how you did this round</p>
                  <div className="relative inline-flex items-center justify-center w-40 h-40 mx-auto mb-4">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="rgb(229 231 235)"
                        strokeWidth="8"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="42"
                        fill="none"
                        stroke="url(#scoreGradMock)"
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={`${pct * 2.64} 264`}
                      />
                      <defs>
                        <linearGradient id="scoreGradMock" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#14b8a6" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold text-gray-800">
                        {result.correctCount}/{result.totalQuestions}
                      </span>
                      <span className="text-sm text-gray-500 mt-1">{pct}%</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500">
                    <span className="text-emerald-600 font-semibold">
                      {result.correctCount} correct
                    </span>
                    {" · "}
                    <span className="text-rose-600 font-semibold">
                      {result.wrongCount} wrong
                    </span>
                  </p>
                  <div className="mt-8 flex flex-wrap justify-center gap-3">
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      className="inline-flex items-center justify-center font-semibold text-sm sm:text-base border-2 border-gray-200 bg-white text-gray-800 py-3 px-6 rounded-2xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      onClick={resetFlow}
                    >
                      New test
                    </motion.button>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02, y: -1 }}
                      whileTap={{ scale: 0.98, y: 0 }}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                      onClick={() => navigate("/mock-test/history")}
                      className="inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      History
                    </motion.button>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="w-1 h-6 rounded-full bg-gradient-to-b from-emerald-600 to-teal-500" />
                    Answer review
                  </h3>
                  <div className="space-y-3">
                    {result.results.map((r, i) => (
                      <motion.div
                        key={r.questionId}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`rounded-2xl border-2 p-5 transition-all duration-300 ${
                          r.isCorrect
                            ? "border-emerald-200 bg-emerald-50/50"
                            : "border-rose-200 bg-rose-50/50"
                        }`}
                      >
                        <div className="flex items-start gap-3 mb-2">
                          {r.isCorrect ? (
                            <FaCheckCircle className="text-emerald-600 mt-0.5 shrink-0" />
                          ) : (
                            <FaTimesCircle className="text-rose-500 mt-0.5 shrink-0" />
                          )}
                          <span className="text-xs text-gray-500 uppercase tracking-wide">
                            Q{i + 1}
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium mb-3 leading-relaxed">
                          {r.question}
                        </p>
                        <p className="text-sm">
                          <span className="text-gray-500">Your answer: </span>
                          <span
                            className={
                              r.isCorrect
                                ? "text-emerald-700 font-semibold"
                                : "text-rose-700 font-semibold"
                            }
                          >
                            {r.selectedOption || "(no answer)"}
                          </span>
                        </p>
                        {!r.isCorrect && (
                          <p className="text-sm mt-2">
                            <span className="text-gray-500">Correct: </span>
                            <span className="text-emerald-700 font-semibold">
                              {r.correctAnswer}
                            </span>
                          </p>
                        )}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </PageShell>

      <Footer />
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </MainLayout>
  );
}

export default MockTestPage;
