import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsRobot, BsCoin } from "react-icons/bs";
import { HiOutlineLogout, HiMenuAlt3, HiX } from "react-icons/hi";
import { FaUserAstronaut } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import axios from "axios";
import { ServerUrl } from "../App";
import { setUserData } from "../redux/userSlice";
import AuthModel from "./AuthModel";

function Navbar() {
  const { userData } = useSelector((state) => state.user);
  const [showCreditPopup, setShowCreditPopup] = useState(false);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const pathname = location.pathname;

  const handleLogout = async () => {
    try {
      await axios.get(ServerUrl + "/api/auth/logout", { withCredentials: true });
      dispatch(setUserData(null));
      setShowCreditPopup(false);
      setShowUserPopup(false);
      setMobileOpen(false);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  const go = (to) => {
    navigate(to);
    setMobileOpen(false);
    setShowCreditPopup(false);
    setShowUserPopup(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white/75 backdrop-blur-md border-b border-gray-200 shadow-sm">
        <div className="flex justify-center px-4 pt-3 pb-3">
          <div className="w-full max-w-6xl bg-white rounded-[24px] shadow-sm border border-gray-200 px-4 sm:px-6 py-3 flex flex-wrap gap-y-2 justify-between items-center relative">
            <div
              className="flex items-center gap-3 cursor-pointer shrink-0"
              onClick={() => go("/")}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && go("/")}
            >
              <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white p-2 rounded-xl shadow-sm">
                <BsRobot size={18} />
              </div>
              <h1 className="font-semibold hidden sm:block text-lg text-gray-800">
                CareerNexa.AI
              </h1>
            </div>

            {/* Desktop nav */}
            <nav className="hidden lg:flex flex-1 min-w-0 items-center justify-center gap-1 xl:gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => go("/")}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-emerald-50/60"
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => go("/interview")}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/interview"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-emerald-50/60"
                }`}
              >
                Interview
              </button>
              <button
                type="button"
                onClick={() => go("/mock-test")}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname.startsWith("/mock-test")
                    ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-emerald-50/60"
                }`}
              >
                Mock Test
              </button>
              <button
                type="button"
                onClick={() => go("/job-analyzer")}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/job-analyzer"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-emerald-50/60"
                }`}
              >
                Job Analyzer
              </button>
              <button
                type="button"
                onClick={() => go("/resume-jobs")}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/resume-jobs"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-emerald-50/60"
                }`}
              >
                Resume Jobs
              </button>
              <button
                type="button"
                onClick={() => go("/history")}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/history"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-emerald-50/60"
                }`}
              >
                History
              </button>
              <button
                type="button"
                onClick={() => go("/pricing")}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
                  pathname === "/pricing"
                    ? "bg-emerald-100 text-emerald-700 shadow-sm ring-1 ring-emerald-200"
                    : "text-gray-600 hover:text-gray-800 hover:bg-emerald-50/60"
                }`}
              >
                Pricing
              </button>
            </nav>

            <div className="flex items-center gap-2 sm:gap-4 relative shrink-0">
              <button
                type="button"
                className="lg:hidden p-2 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50"
                aria-label="Menu"
                onClick={() => setMobileOpen((o) => !o)}
              >
                {mobileOpen ? <HiX size={22} /> : <HiMenuAlt3 size={22} />}
              </button>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    setShowCreditPopup(!showCreditPopup);
                    setShowUserPopup(false);
                  }}
                  className="flex items-center gap-2 bg-gray-100 border border-gray-200 px-3 sm:px-4 py-2 rounded-full text-sm text-gray-800 hover:bg-emerald-50/80 hover:border-emerald-200 transition"
                >
                  <BsCoin size={18} />
                  <span className="font-medium">{userData?.credits ?? 0}</span>
                </button>

                {showCreditPopup && (
                  <div className="absolute right-0 sm:right-[-20px] mt-3 w-64 bg-white shadow-xl border border-gray-200 rounded-xl p-5 z-50">
                    <p className="text-sm text-gray-600 mb-4">
                      Need more credits to continue interviews?
                    </p>
                    <button
                      type="button"
                      onClick={() => go("/pricing")}
                      className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-2.5 rounded-xl text-sm font-semibold shadow-md hover:opacity-90 transition"
                    >
                      Buy more credits
                    </button>
                  </div>
                )}
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    if (!userData) {
                      setShowAuth(true);
                      return;
                    }
                    setShowUserPopup(!showUserPopup);
                    setShowCreditPopup(false);
                  }}
                  className="w-9 h-9 bg-gradient-to-br from-emerald-600 to-teal-500 text-white rounded-full flex items-center justify-center font-semibold text-sm shadow-sm"
                >
                  {userData ? (
                    userData?.name.slice(0, 1).toUpperCase()
                  ) : (
                    <FaUserAstronaut size={16} />
                  )}
                </button>

                {showUserPopup && (
                  <div className="absolute right-0 mt-3 w-52 bg-white shadow-xl border border-gray-200 rounded-xl p-4 z-50">
                    <p className="text-md text-emerald-700 font-semibold mb-1 truncate">
                      {userData?.name}
                    </p>
                    <button
                      type="button"
                      onClick={() => go("/history")}
                      className="w-full text-left text-sm py-2 hover:text-black text-gray-600"
                    >
                      Interview History
                    </button>
                    <button
                      type="button"
                      onClick={() => go("/mock-test/history")}
                      className="w-full text-left text-sm py-2 hover:text-black text-gray-600"
                    >
                      Mock Test History
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="w-full text-left text-sm py-2 flex items-center gap-2 text-red-500"
                    >
                      <HiOutlineLogout size={16} />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {mobileOpen && (
          <div className="lg:hidden overflow-hidden border-t border-gray-200 bg-white/98 backdrop-blur-md">
            <div className="px-4 py-4 flex flex-col gap-1 max-w-6xl mx-auto">
              <button
                type="button"
                onClick={() => go("/")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === "/"
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Home
              </button>
              <button
                type="button"
                onClick={() => go("/interview")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === "/interview"
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Interview
              </button>
              <button
                type="button"
                onClick={() => go("/mock-test")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname.startsWith("/mock-test")
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Mock Test
              </button>
              <button
                type="button"
                onClick={() => go("/job-analyzer")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === "/job-analyzer"
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Job Analyzer
              </button>
              <button
                type="button"
                onClick={() => go("/resume-jobs")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === "/resume-jobs"
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Resume Jobs
              </button>
              <button
                type="button"
                onClick={() => go("/history")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === "/history"
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                History
              </button>
              <button
                type="button"
                onClick={() => go("/pricing")}
                className={`text-left px-4 py-3 rounded-xl text-sm font-medium ${
                  pathname === "/pricing"
                    ? "bg-emerald-100 text-emerald-800"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                Pricing
              </button>
            </div>
          </div>
        )}
      </header>
    <AnimatePresence>
      {showAuth && <AuthModel onClose={() => setShowAuth(false)} />}
    </AnimatePresence>
    </>
  );
}

export default Navbar;
