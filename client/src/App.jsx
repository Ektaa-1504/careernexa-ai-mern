import React, { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUserData } from "./redux/userSlice";

import LandingPage from "./pages/LandingPage";
import Auth from "./pages/Auth";
import InterviewPage from "./pages/InterviewPage";
import InterviewHistory from "./pages/InterviewHistory";
import Pricing from "./pages/Pricing";
import InterviewReport from "./pages/InterviewReport";
import MockTestPage from "./pages/MockTestPage";
import MockTestHistoryPage from "./pages/MockTestHistoryPage";
import JobAnalyzerPage from "./pages/JobAnalyzerPage";
import ResumeJobsPage from "./pages/ResumeJobsPage";

export const ServerUrl = "http://localhost:8000";

function App() {
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await axios.get(ServerUrl + "/api/user/current-user", {
          withCredentials: true,
        });
        dispatch(setUserData(result.data));
      } catch (error) {
        console.log(error);
        dispatch(setUserData(null));
      }
    };
    getUser();
  }, [dispatch]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/interview" element={<InterviewPage />} />
        <Route path="/history" element={<InterviewHistory />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/report/:id" element={<InterviewReport />} />
        <Route path="/mock-test" element={<MockTestPage />} />
        <Route path="/mock-test/history" element={<MockTestHistoryPage />} />
        <Route path="/job-analyzer" element={<JobAnalyzerPage />} />
        <Route path="/resume-jobs" element={<ResumeJobsPage />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;


