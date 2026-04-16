import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  BsRobot,
  BsMic,
  BsClock,
  BsBarChart,
  BsFileEarmarkText,
} from "react-icons/bs";
import { HiSparkles } from "react-icons/hi";
import { useNavigate } from "react-router-dom";
import AuthModel from "../components/AuthModel";
import hrImg from "../assets/HR.png";
import techImg from "../assets/tech.png";
import confidenceImg from "../assets/confi.png";
import creditImg from "../assets/credit.png";
import evalImg from "../assets/ai-ans.png";
import resumeImg from "../assets/resume.png";
import pdfImg from "../assets/pdf.png";
import analyticsImg from "../assets/history.png";
import Footer from "../components/Footer";
import MainLayout from "../components/MainLayout";
import PageShell from "../components/PageShell";
import { motion } from "motion/react";

/**
 * Interview hub: original marketing + entry to the interview flow.
 * Mock Test and Job Description Analyzer promo cards removed only.
 */
function InterviewHubPage({ onStartInterview }) {
  const { userData } = useSelector((state) => state.user);
  const [showAuth, setShowAuth] = useState(false);
  const navigate = useNavigate();

  const handleStartInterview = () => {
    if (!userData) {
      setShowAuth(true);
      return;
    }
    onStartInterview?.();
  };

  return (
    <MainLayout>
      <PageShell className="flex-1 flex flex-col">
        <div className="flex-1 mx-auto w-full max-w-6xl px-4 sm:px-6 py-12 lg:py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-center mb-6">
              <div className="bg-white border border-gray-200 text-gray-600 text-sm px-4 py-2 rounded-full flex items-center gap-2 shadow-sm">
                <HiSparkles size={16} className="text-emerald-600" />
                AI Powered Smart Interview Platform
              </div>
            </div>
            <div className="text-center mb-20 lg:mb-28">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 tracking-tight max-w-4xl mx-auto leading-tight">
                Practice Interviews with
                <span className="relative inline-block ml-2">
                  <span className="bg-emerald-100 text-emerald-700 px-5 py-1.5 rounded-full">
                    AI Intelligence
                  </span>
                </span>
              </h1>

              <p className="text-lg text-gray-500 mt-6 max-w-2xl mx-auto">
                Role-based mock interviews with smart follow-ups, adaptive
                difficulty and real-time performance evaluation.
              </p>

              <div className="flex flex-wrap justify-center gap-4 mt-10">
                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={handleStartInterview}
                  className="inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  Start Interview
                </motion.button>

                <motion.button
                  type="button"
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98, y: 0 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    navigate("/history");
                  }}
                  className="inline-flex items-center justify-center font-semibold text-sm sm:text-base border-2 border-gray-200 bg-white text-gray-800 py-3 px-6 rounded-2xl shadow-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  View History
                </motion.button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
              {[
                {
                  icon: <BsRobot size={24} />,
                  step: "STEP 1",
                  title: "Role & Experience Selection",
                  desc: "AI adjusts difficulty based on selected job role.",
                },
                {
                  icon: <BsMic size={24} />,
                  step: "STEP 2",
                  title: "Smart Voice Interview",
                  desc: "Dynamic follow-up questions based on your answers.",
                },
                {
                  icon: <BsClock size={24} />,
                  step: "STEP 3",
                  title: "Timer Based Simulation",
                  desc: "Real interview pressure with time tracking.",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className={`
        relative bg-white rounded-3xl border-2 border-emerald-100 
        hover:border-emerald-500 p-10 w-80 max-w-[90%] shadow-md hover:shadow-2xl 
        transition-all duration-300
        ${index === 0 ? "rotate-[-4deg]" : ""}
        ${index === 1 ? "rotate-[3deg] md:-mt-6 shadow-xl" : ""}
        ${index === 2 ? "rotate-[-3deg]" : ""}
      `}
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white border-2 border-emerald-500 text-emerald-600 w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg">
                    {item.icon}
                  </div>
                  <div className="pt-10 text-center">
                    <div className="text-xs text-emerald-600 font-semibold mb-2 tracking-wider">
                      {item.step}
                    </div>
                    <h3 className="font-semibold mb-3 text-lg">{item.title}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mb-32">
              <h2 className="text-4xl font-semibold text-center mb-16">
                Advanced AI <span className="text-emerald-600">Capabilities</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                {[
                  {
                    image: evalImg,
                    icon: <BsBarChart size={20} />,
                    title: "AI Answer Evaluation",
                    desc: "Scores communication, technical accuracy and confidence.",
                  },
                  {
                    image: resumeImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Resume Based Interview",
                    desc: "Project-specific questions based on uploaded resume.",
                  },
                  {
                    image: pdfImg,
                    icon: <BsFileEarmarkText size={20} />,
                    title: "Downloadable PDF Report",
                    desc: "Detailed strengths, weaknesses and improvement insights.",
                  },
                  {
                    image: analyticsImg,
                    icon: <BsBarChart size={20} />,
                    title: "History & Analytics",
                    desc: "Track progress with performance graphs and topic analysis.",
                  },
                ].map((item, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-full md:w-1/2 flex justify-center">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-auto object-contain max-h-64"
                        />
                      </div>

                      <div className="w-full md:w-1/2">
                        <div className="bg-emerald-50 text-emerald-600 w-12 h-12 rounded-xl flex items-center justify-center mb-6">
                          {item.icon}
                        </div>
                        <h3 className="font-semibold mb-3 text-xl">{item.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-32">
              <h2 className="text-4xl font-semibold text-center mb-16">
                Multiple Interview <span className="text-emerald-600">Modes</span>
              </h2>

              <div className="grid md:grid-cols-2 gap-10">
                {[
                  {
                    img: hrImg,
                    title: "HR Interview Mode",
                    desc: "Behavioral and communication based evaluation.",
                  },
                  {
                    img: techImg,
                    title: "Technical Mode",
                    desc: "Deep technical questioning based on selected role.",
                  },
                  {
                    img: confidenceImg,
                    title: "Confidence Detection",
                    desc: "Basic tone and voice analysis insights.",
                  },
                  {
                    img: creditImg,
                    title: "Credits System",
                    desc: "Unlock premium interview sessions easily.",
                  },
                ].map((mode, index) => (
                  <div
                    key={index}
                    className="bg-white border border-gray-200 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center justify-between gap-6">
                      <div className="w-1/2">
                        <h3 className="font-semibold text-xl mb-3">{mode.title}</h3>
                        <p className="text-gray-500 text-sm leading-relaxed">{mode.desc}</p>
                      </div>
                      <div className="w-1/2 flex justify-end">
                        <img
                          src={mode.img}
                          alt={mode.title}
                          className="w-28 h-28 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </PageShell>

      <Footer />
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </MainLayout>
  );
}

export default InterviewHubPage;
