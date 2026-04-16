import React, { useState } from "react";
import Step1SetUp from "../components/Step1SetUp";
import Step2Interview from "../components/Step2Interview";
import Step3Report from "../components/Step3Report";
import InterviewHubPage from "./InterviewHubPage";

/**
 * /interview — hub (marketing + Start Interview) then existing step flow unchanged.
 */
function InterviewPage() {
  const [inFlow, setInFlow] = useState(false);
  const [step, setStep] = useState(1);
  const [interviewData, setInterviewData] = useState(null);

  if (!inFlow) {
    return <InterviewHubPage onStartInterview={() => setInFlow(true)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      {step === 1 && (
        <Step1SetUp
          onStart={(data) => {
            setInterviewData(data);
            setStep(2);
          }}
        />
      )}

      {step === 2 && (
        <Step2Interview
          interviewData={interviewData}
          onFinish={(report) => {
            setInterviewData(report);
            setStep(3);
          }}
        />
      )}

      {step === 3 && (
        <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 pb-10">
          <Step3Report report={interviewData} />
        </div>
      )}
    </div>
  );
}

export default InterviewPage;
