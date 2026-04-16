import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "motion/react";
import {
  BsMic,
  BsClipboard2Check,
  BsBriefcase,
  BsGraphUpArrow,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import MainLayout from "../components/MainLayout";
import PageShell from "../components/PageShell";
import Footer from "../components/Footer";
import AuthModel from "../components/AuthModel";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const FEATURE_CARDS = [
  {
    title: "AI Interview",
    desc: "Voice-based mock interviews with smart scoring and feedback.",
    Icon: BsMic,
    path: "/interview",
    needLogin: true,
  },
  {
    title: "Mock Tests",
    desc: "DSA, DBMS, OS & OOP — AI-generated timed MCQs.",
    Icon: BsClipboard2Check,
    path: "/mock-test",
    needLogin: true,
  },
  {
    title: "Job Analyzer",
    desc: "Extract skills, responsibilities, and resume keywords from JDs.",
    Icon: BsBriefcase,
    path: "/job-analyzer",
    needLogin: true,
  },
  {
    title: "Performance Reports",
    desc: "Track interview history and detailed performance insights.",
    Icon: BsGraphUpArrow,
    path: "/history",
    needLogin: true,
  },
];

function LandingPage() {
  const { userData } = useSelector((s) => s.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  function goTo(path, needLogin) {
    if (needLogin && !userData) {
      setShowAuth(true);
      return;
    }
    navigate(path);
  }

  function scrollToFeatures() {
    const el = document.getElementById("features");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <MainLayout>
      <PageShell className="flex flex-1 flex-col">
        <div className="flex-1 w-full">
          {/* ===================== HERO ===================== */}
          <section className="px-4 pb-16 pt-8 sm:px-6 md:pb-24 md:pt-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="mx-auto w-full max-w-6xl overflow-hidden rounded-[2rem] border border-gray-200 bg-gradient-to-br from-emerald-50 via-white to-teal-50 px-6 py-14 shadow-xl sm:px-10 sm:py-16 md:py-20"
            >
              <div className="mx-auto max-w-3xl text-center">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="mb-8 flex justify-center"
                >
                  <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm">
                    <HiSparkles size={16} className="text-emerald-600" />
                    AI Career Platform
                  </div>
                </motion.div>

                <h1 className="text-4xl font-bold leading-tight tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
                  Land your next role{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    with confidence
                  </span>
                </h1>

                <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-gray-600 sm:text-lg md:text-xl">
                  Prepare, practice, and get hired with AI — voice interviews,
                  smart feedback, and progress you can measure.
                </p>

                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => goTo("/interview", true)}
                    className="inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Start Interview
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={scrollToFeatures}
                    className="inline-flex items-center justify-center font-semibold text-sm sm:text-base border-2 border-gray-200 bg-white text-gray-800 py-3 px-6 rounded-2xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Explore Features
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </section>

          {/* ===================== FEATURE CARDS ===================== */}
          <section id="features" className="pb-20 md:pb-28">
            <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-4 pt-8 lg:pt-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-12 text-center"
              >
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-gray-800 md:text-3xl">
                  Built for serious{" "}
                  <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                    preparation
                  </span>
                </h2>
                <p className="mx-auto max-w-2xl text-base leading-relaxed text-gray-500">
                  One calm, focused workspace for interviews, quizzes, job
                  analysis, and tracking how you improve.
                </p>
              </motion.div>

              <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4"
              >
                {FEATURE_CARDS.map((card) => {
                  const Icon = card.Icon;
                  return (
                    <motion.button
                      variants={itemVariants}
                      key={card.title}
                      type="button"
                      onClick={() => goTo(card.path, card.needLogin)}
                      whileHover={{ y: -5, shadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)" }}
                      className="rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-lg shadow-gray-200/50 transition-all duration-300"
                    >
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50 text-emerald-600">
                        <Icon size={22} />
                      </div>
                      <h3 className="mb-2 text-lg font-semibold text-gray-800">
                        {card.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-gray-500">
                        {card.desc}
                      </p>
                    </motion.button>
                  );
                })}
              </motion.div>
            </div>
          </section>

          {/* ===================== BOTTOM CTA BANNER ===================== */}
          <section className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6 md:pb-28">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mx-auto max-w-3xl text-center"
            >
              <div className="rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-600 via-emerald-600 to-teal-600 px-8 py-14 shadow-2xl md:px-12 md:py-16">
                <h2 className="text-2xl font-bold leading-tight text-white md:text-3xl lg:text-4xl">
                  Ready to outperform in your next interview?
                </h2>
                <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-emerald-50 md:text-base">
                  Start your preparation journey today — practice with AI and
                  walk in with clarity and confidence.
                </p>
                <div className="mt-10 flex justify-center">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98, y: 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    onClick={() => goTo("/interview", true)}
                    className="border-0 bg-white text-emerald-700 shadow-lg hover:bg-emerald-50 inline-flex items-center justify-center font-semibold text-sm sm:text-base py-3 px-6 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Start Interview
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </section>
        </div>
      </PageShell>

      <Footer />
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </MainLayout>
  );
}

export default LandingPage;
