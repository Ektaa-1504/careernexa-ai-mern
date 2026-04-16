import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { useSelector } from "react-redux";
import MainLayout from "../components/MainLayout";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";
import AuthModel from "../components/AuthModel";
import { FaArrowLeft, FaFilePdf, FaExternalLinkAlt } from "react-icons/fa";

/**
 * Match % badge color: stronger green for higher scores.
 */
function matchBadgeClass(match) {
  const m = Number(match) || 0;
  if (m >= 75) return "bg-emerald-100 text-emerald-800 border-emerald-200";
  if (m >= 50) return "bg-teal-50 text-teal-800 border-teal-200";
  return "bg-gray-100 text-gray-700 border-gray-200";
}

function ResumeJobsPage() {
  const navigate = useNavigate();
  const { userData } = useSelector((s) => s.user);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fetchError, setFetchError] = useState("");
  const [result, setResult] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setError("");
    setResult(null);
    setFetchError("");
  };

  const analyze = async () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    if (!file) {
      setError("Please choose a PDF resume.");
      return;
    }
    if (file.type !== "application/pdf") {
      setError("Only PDF files are supported.");
      return;
    }

    setLoading(true);
    setError("");
    setFetchError("");
    setResult(null);

    const formData = new FormData();
    formData.append("resume", file);

    try {
      const res = await axios.post(`${ServerUrl}/api/resume/jobs`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setResult(res.data);
      if (res.data.fetchError) {
        setFetchError(res.data.fetchError);
      }
    } catch (e) {
      console.error(e);
      const msg =
        e?.response?.data?.message ||
        "Request failed. Check your file and try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <PageShell className="flex flex-1 flex-col">
        <div className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-10">
          <button
            type="button"
            onClick={() => navigate("/")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-sm text-gray-500 hover:text-gray-800"
          >
            <FaArrowLeft /> Back
          </button>

          <div className="mb-8">
            <div className="mb-2 flex items-center gap-3">
              <div className="rounded-xl bg-gradient-to-br from-emerald-600 to-teal-500 p-3 text-white shadow-md">
                <FaFilePdf size={22} />
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
                  Resume → Job matches
                </h1>
                <p className="text-sm text-gray-500 mt-1 max-w-xl">
                  Upload your resume. We extract skills and a target role, then
                  show jobs from India with a simple skill match score.
                </p>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-10"
          >
            <label className="mb-2 block text-sm font-semibold text-gray-800">
              Resume (PDF)
            </label>
            <input
              type="file"
              accept="application/pdf,.pdf"
              onChange={onFileChange}
              disabled={loading}
              className="block w-full cursor-pointer rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 text-sm text-gray-700 file:mr-4 file:rounded-lg file:border-0 file:bg-emerald-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-emerald-700"
            />
            <div className="mt-6">
              <motion.button
                type="button"
                whileHover={!(loading || !file) ? { scale: 1.02, y: -1 } : {}}
                whileTap={!(loading || !file) ? { scale: 0.98, y: 0 } : {}}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                onClick={analyze}
                disabled={loading || !file}
                className="w-full sm:w-auto inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {loading ? "Analyzing…" : "Analyze Resume"}
              </motion.button>
            </div>
            {loading && (
              <p className="mt-4 text-sm text-sm text-gray-500">
                Reading PDF, calling AI, fetching jobs… this may take a moment.
              </p>
            )}
            {error && (
              <p className="mt-4 text-sm font-medium text-red-600">{error}</p>
            )}
            {fetchError && (
              <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                {fetchError}
              </p>
            )}
          </motion.div>

          {result && (
            <div className="space-y-10">
              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-2">Suggested role</h2>
                <p className="text-xl font-bold text-gray-800 md:text-2xl">
                  {result.role || "—"}
                </p>
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Skills from resume
                </h2>
                {result.skills?.length ? (
                  <div className="flex flex-wrap gap-2">
                    {result.skills.map((s, i) => (
                      <motion.span
                        key={`${s}-${i}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.03 }}
                        whileHover={{ scale: 1.05 }}
                        className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-800"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No skills extracted.</p>
                )}
              </section>

              <section>
                <h2 className="text-lg font-semibold text-gray-800 mb-6">
                  Matching jobs (India)
                </h2>
                {!result.jobs?.length ? (
                  <p className="text-sm text-gray-500">
                    No jobs returned. Add{" "}
                    <code className="rounded bg-gray-100 px-1">RAPIDAPI_KEY</code>{" "}
                    on the server and subscribe to JSearch on RapidAPI (see
                    docs).
                  </p>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2">
                    {result.jobs.map((job, i) => (
                      <motion.div
                        key={`${job.title}-${i}`}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: i * 0.05 }}
                        whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                        className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-col transition-all duration-300"
                      >
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {job.title}
                            </h3>
                            <p className="mt-1 text-sm text-sm text-gray-500">
                              {job.company}
                            </p>
                          </div>
                          <span
                            className={`shrink-0 rounded-full border px-3 py-1 text-xs font-bold ${matchBadgeClass(job.match)}`}
                          >
                            {job.match}%
                          </span>
                        </div>
                        <a
                          href={job.link && job.link !== "#" ? job.link : undefined}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`mt-auto inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 px-4 py-2.5 text-center text-sm font-semibold text-white shadow-md transition hover:opacity-90 ${
                            !job.link || job.link === "#"
                              ? "pointer-events-none opacity-50"
                              : ""
                          }`}
                        >
                          Apply <FaExternalLinkAlt size={12} />
                        </a>
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </PageShell>
      <Footer />
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </MainLayout>
  );
}

export default ResumeJobsPage;
