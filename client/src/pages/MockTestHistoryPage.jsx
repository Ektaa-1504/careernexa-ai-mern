import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import Footer from "../components/Footer";
import MainLayout from "../components/MainLayout";
import PageShell from "../components/PageShell";
import { FaArrowLeft } from "react-icons/fa";

const CATEGORY_LABEL = {
  DSA: "DSA",
  DBMS: "DBMS",
  OS: "Operating Systems",
  OOPS: "Object-Oriented Programming",
};

function MockTestHistoryPage() {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await axios.get(`${ServerUrl}/api/mock-test/history`, {
          withCredentials: true,
        });
        setHistory(res.data.history || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleString();
  };

  return (
    <MainLayout>
      <PageShell className="flex-1 flex flex-col">
        <div className="flex-1 px-4 py-10 max-w-3xl mx-auto w-full">
          <button
            type="button"
            onClick={() => navigate("/mock-test")}
            className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition font-medium"
          >
            <FaArrowLeft /> Back to Mock Test
          </button>

          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight">
            Mock Test History
          </h1>
          <p className="text-sm text-gray-500 mb-8 text-base">
            Recent AI & practice quiz attempts on your account.
          </p>

          {loading && (
            <p className="text-gray-500 flex items-center gap-2">
              <span className="inline-block w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
              Loading…
            </p>
          )}

          {!loading && history.length === 0 && (
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">
              <p className="text-sm text-gray-500">No mock tests yet.</p>{" "}
              <button
                type="button"
                onClick={() => navigate("/mock-test")}
                className="text-emerald-600 font-semibold hover:underline mt-2 inline-block"
              >
                Take a test
              </button>
            </div>
          )}

          <div className="space-y-3">
            {history.map((row, i) => (
              <motion.div
                key={row._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                whileHover={{ y: -3, scale: 1.01, borderColor: "rgb(16 185 129 / 0.3)" }}
                whileTap={{ scale: 0.99 }}
                className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 flex flex-wrap justify-between gap-4 transition-colors duration-300 cursor-default"
              >
                <div>
                  <p className="font-semibold text-gray-800">
                    {CATEGORY_LABEL[row.category] || row.category}
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(row.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    {row.correctCount}/{row.totalQuestions}
                  </p>
                  <p className="text-xs text-gray-500">score</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </PageShell>
      <Footer />
    </MainLayout>
  );
}

export default MockTestHistoryPage;
