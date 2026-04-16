import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import Footer from "../components/Footer";
import MainLayout from "../components/MainLayout";
import PageShell from "../components/PageShell";
import { FaArrowLeft, FaBriefcase } from "react-icons/fa";
import { useSelector } from "react-redux";
import AuthModel from "../components/AuthModel";

function JobAnalyzerPage() {
  const navigate = useNavigate();
  const { userData } = useSelector((s) => s.user);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [showAuth, setShowAuth] = useState(false);

  const analyze = async () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    setLoading(true);
    setError("");
    setData(null);
    try {
      const res = await axios.post(
        `${ServerUrl}/api/job/analyze`,
        { jobDescription: text },
        { withCredentials: true }
      );
      setData(res.data);
    } catch (e) {
      console.error(e);
      setError(e?.response?.data?.message || "Analysis failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const levelColor = (level) => {
    const l = (level || "").toLowerCase();
    if (l.includes("beginner")) return "bg-blue-100 text-blue-800";
    if (l.includes("intermediate")) return "bg-amber-100 text-amber-800";
    if (l.includes("advanced")) return "bg-purple-100 text-purple-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <MainLayout>
    <PageShell className="flex-1 flex flex-col">
      <div className="flex-1 px-4 py-10 max-w-4xl mx-auto w-full">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 font-medium text-sm"
        >
          <FaArrowLeft /> Back to Home
        </button>

        <div className="flex items-center gap-3 mb-2">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white p-3 rounded-xl shadow-md">
            <FaBriefcase size={22} />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
              Job Description Analyzer
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Paste a job posting and get skills, responsibilities, and resume keywords.
            </p>
          </div>
        </div>

        <div className="mt-8 bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Job description
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste the full job description here…"
            rows={12}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800 text-base placeholder:text-gray-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-200 min-h-[120px] resize-y min-h-[200px]"
          />
          <motion.button
            type="button"
            whileHover={!(loading || text.trim().length < 50) ? { scale: 1.02, y: -1 } : {}}
            whileTap={!(loading || text.trim().length < 50) ? { scale: 0.98, y: 0 } : {}}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            onClick={analyze}
            disabled={loading || text.trim().length < 50}
            className="mt-4 w-full sm:w-auto inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Analyzing…" : "Analyze Job"}
          </motion.button>
          {text.trim().length > 0 && text.trim().length < 50 && (
            <p className="text-xs text-amber-600 mt-2">
              Enter at least 50 characters for a meaningful analysis.
            </p>
          )}
        </div>

        {error && (
          <div className="mt-4 rounded-xl bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
            {error}
          </div>
        )}

        {data && (
          <div className="mt-10 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300"
            >
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Experience level
              </h2>
              <span
                className={`inline-block px-4 py-1.5 rounded-full text-sm font-semibold ${levelColor(
                  data.experienceLevel
                )}`}
              >
                {data.experienceLevel || "—"}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Technical skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {(data.skills || []).map((s, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
                {(!data.skills || data.skills.length === 0) && (
                  <p className="text-gray-400 text-sm">No skills extracted.</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Soft skills
              </h2>
              <div className="flex flex-wrap gap-2">
                {(data.softSkills || []).map((s, i) => (
                  <span
                    key={i}
                    className="bg-sky-50 text-sky-800 border border-sky-200 px-3 py-1 rounded-full text-sm"
                  >
                    {s}
                  </span>
                ))}
                {(!data.softSkills || data.softSkills.length === 0) && (
                  <p className="text-gray-400 text-sm">No soft skills extracted.</p>
                )}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Key responsibilities
              </h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                {(data.responsibilities || []).map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
              {(!data.responsibilities || data.responsibilities.length === 0) && (
                <p className="text-gray-400 text-sm">No responsibilities listed.</p>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ y: -4, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
              className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 transition-all duration-300"
            >
              <h2 className="text-lg font-semibold text-gray-800 mb-3">
                Resume keywords
              </h2>
              <div className="flex flex-wrap gap-2">
                {(data.keywords || []).map((k, i) => (
                  <span
                    key={i}
                    className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1 rounded-lg text-sm"
                  >
                    {k}
                  </span>
                ))}
                {(!data.keywords || data.keywords.length === 0) && (
                  <p className="text-gray-400 text-sm">No keywords extracted.</p>
                )}
              </div>
            </motion.div>

          </div>
        )}
      </div>
    </PageShell>
      <Footer />
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </MainLayout>
  );
}

export default JobAnalyzerPage;
