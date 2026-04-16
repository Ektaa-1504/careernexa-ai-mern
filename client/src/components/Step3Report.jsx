import React from 'react'
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { motion } from "motion/react";

function Step3Report({ report }) {
  const navigate = useNavigate()
  if (!report) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center w-full">
        <p className="text-sm text-gray-500 text-base">Loading Report...</p>
      </div>
    );
  }
  const {
    finalScore = 0,
    confidence = 0,
    communication = 0,
    correctness = 0,
    questionWiseScore = [],
  } = report;

  const questionScoreData = questionWiseScore.map((score, index) => ({
    name: `Q${index + 1}`,
    score: score.score || 0
  }))

  const skills = [
    { label: "Confidence", value: confidence },
    { label: "Communication", value: communication },
    { label: "Correctness", value: correctness },
  ];

  let performanceText = "";
  let shortTagline = "";

  if (finalScore >= 8) {
    performanceText = "Ready for job opportunities.";
    shortTagline = "Excellent clarity and structured responses.";
  } else if (finalScore >= 5) {
    performanceText = "Needs minor improvement before interviews.";
    shortTagline = "Good foundation, refine articulation.";
  } else {
    performanceText = "Significant improvement required.";
    shortTagline = "Work on clarity and confidence.";
  }

  const score = finalScore;
  const percentage = (score / 10) * 100;


  const downloadPDF = () => {
  const doc = new jsPDF("p", "mm", "a4");

  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  let currentY = 25;

  // ================= TITLE =================
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(34, 197, 94);
  doc.text("AI Interview Performance Report", pageWidth / 2, currentY, {
    align: "center",
  });

  currentY += 5;

  // underline
  doc.setDrawColor(34, 197, 94);
  doc.line(margin, currentY + 2, pageWidth - margin, currentY + 2);

  currentY += 15;

  // ================= FINAL SCORE BOX =================
  doc.setFillColor(240, 253, 244);
  doc.roundedRect(margin, currentY, contentWidth, 20, 4, 4, "F");

  doc.setFontSize(14);
  doc.setTextColor(0, 0, 0);
  doc.text(
    `Final Score: ${finalScore}/10`,
    pageWidth / 2,
    currentY + 12,
    { align: "center" }
  );

  currentY += 30;

  // ================= SKILLS BOX =================
  doc.setFillColor(249, 250, 251);
  doc.roundedRect(margin, currentY, contentWidth, 30, 4, 4, "F");

  doc.setFontSize(12);

  doc.text(`Confidence: ${confidence}`, margin + 10, currentY + 10);
  doc.text(`Communication: ${communication}`, margin + 10, currentY + 18);
  doc.text(`Correctness: ${correctness}`, margin + 10, currentY + 26);

  currentY += 45;

  // ================= ADVICE =================
  let advice = "";

  if (finalScore >= 8) {
    advice =
      "Excellent performance. Maintain confidence and structure. Continue refining clarity and supporting answers with strong real-world examples.";
  } else if (finalScore >= 5) {
    advice =
      "Good foundation shown. Improve clarity and structure. Practice delivering concise, confident answers with stronger supporting examples.";
  } else {
    advice =
      "Significant improvement required. Focus on structured thinking, clarity, and confident delivery. Practice answering aloud regularly.";
  }

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(220);
  doc.roundedRect(margin, currentY, contentWidth, 35, 4, 4);

  doc.setFont("helvetica", "bold");
  doc.text("Professional Advice", margin + 10, currentY + 10);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);

  const splitAdvice = doc.splitTextToSize(advice, contentWidth - 20);
  doc.text(splitAdvice, margin + 10, currentY + 20);

  currentY += 50;

  // ================= QUESTION TABLE =================
  autoTable(doc, {
  startY: currentY,
  margin: { left: margin, right: margin },
  head: [["#", "Question", "Score", "Feedback"]],
  body: questionWiseScore.map((q, i) => [
    `${i + 1}`,
    q.question,
    `${q.score}/10`,
    q.feedback,
  ]),
  styles: {
    fontSize: 9,
    cellPadding: 5,
    valign: "top",
  },
  headStyles: {
    fillColor: [34, 197, 94],
    textColor: 255,
    halign: "center",
  },
  columnStyles: {
    0: { cellWidth: 10, halign: "center" }, // index
    1: { cellWidth: 55 }, // question
    2: { cellWidth: 20, halign: "center" }, // score
    3: { cellWidth: "auto" }, // feedback
  },
  alternateRowStyles: {
    fillColor: [249, 250, 251],
  },
});


  doc.save("AI_Interview_Report.pdf");
};

  return (
    <div className="w-full py-6 sm:py-8">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="md:mb-6 w-full flex items-start gap-4 flex-wrap">
          <button
            type="button"
            onClick={() => navigate("/history")}
            className="mt-1 p-3 rounded-2xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition"
          >
            <FaArrowLeft className="text-gray-600" />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Interview Analytics Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-2 text-base">
              AI-powered performance insights
            </p>
          </div>
        </div>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={downloadPDF}
          className="text-nowrap shrink-0 inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Download PDF
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 text-center">

            <h3 className="text-sm sm:text-base font-semibold text-gray-800 mb-4 sm:mb-6">
              Overall Performance
            </h3>
            <div className='relative w-20 h-20 sm:w-25 sm:h-25 mx-auto'>
              <CircularProgressbar
                value={percentage}
                text={`${score}/10`}
                styles={buildStyles({
                  textSize: "18px",
                  pathColor: "#10b981",
                  textColor: "#1f2937",
                  trailColor: "#e5e7eb",
                })}
              />
            </div>

            <p className="text-gray-400 mt-3 text-xs sm:text-sm">
              Out of 10
            </p>

            <div className="mt-4">
              <p className="font-semibold text-gray-800 text-sm sm:text-base">
                {performanceText}
              </p>
              <p className="text-gray-500 text-xs sm:text-sm mt-1">
                {shortTagline}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Skill Evaluation
            </h3>

            <div className='space-y-5'>
              {
                skills.map((s, i) => (
                  <div key={i}>
                    <div className='flex justify-between mb-2 text-sm sm:text-base'>

                      <span>{s.label}</span>
                      <span className="font-semibold text-emerald-600">{s.value}</span>
                    </div>

                    <div className="bg-gray-200 h-2 sm:h-3 rounded-full">
                      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full"
                        style={{ width: `${s.value * 10}%` }}

                      ></div>

                    </div>


                  </div>
                ))
              }
            </div>

          </div>


        </div>

        <div className='lg:col-span-2 space-y-6'>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 sm:mb-6">
              Performance Trend
            </h3>

            <div className='h-64 sm:h-72'>

              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={questionScoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip />
                  <Area type="monotone"
                    dataKey="score"
                    stroke="#10b981"
                    fill="#a7f3d0"
                    strokeWidth={3} />


                </AreaChart>

              </ResponsiveContainer>


            </div>


          </div>

          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Question Breakdown
            </h3>
            <div className='space-y-6'>
              {questionWiseScore.map((q, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 p-4 sm:p-6"
                >

                  <div className='flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4'>
                    <div>
                      <p className="text-xs text-gray-400">
                        Question {i + 1}
                      </p>

                      <p className="font-semibold text-gray-800 text-sm sm:text-base leading-relaxed">
                        {q.question || "Question not available"}
                      </p>
                    </div>


                    <div className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full font-bold text-xs sm:text-sm w-fit border border-emerald-200">
                      {q.score ?? 0}/10
                    </div>
                  </div>

                  <div className="bg-emerald-50/80 border border-emerald-100 p-4 rounded-xl">
                    <p className="text-xs text-emerald-700 font-semibold mb-1">
                      AI Feedback
                    </p>
                    <p className='text-sm text-gray-700 leading-relaxed'>

                      {q.feedback && q.feedback.trim() !== ""
                        ? q.feedback
                        : "No feedback available for this question."}
                    </p>
                  </div>

                </div>
              ))}
            </div>

          </div>





        </div>
      </div>

    </div>
  )
}

export default Step3Report
