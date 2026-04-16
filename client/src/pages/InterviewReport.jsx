import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ServerUrl } from "../App";
import Step3Report from "../components/Step3Report";
import MainLayout from "../components/MainLayout";
import PageShell from "../components/PageShell";

function InterviewReport() {
  const { id } = useParams();
  const [report, setReport] = useState(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const result = await axios.get(
          ServerUrl + "/api/interview/report/" + id,
          { withCredentials: true },
        );
        setReport(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReport();
  }, [id]);

  if (!report) {
    return (
      <MainLayout>
        <PageShell className="flex-1 flex flex-col">
          <div className="flex flex-1 items-center justify-center py-24">
            <p className="text-sm text-gray-500 text-base">
              Loading Report...
            </p>
          </div>
        </PageShell>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <PageShell className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 py-6 sm:py-8">
          <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
            <Step3Report report={report} />
          </div>
        </div>
      </PageShell>
    </MainLayout>
  );
}

export default InterviewReport;
