import React from "react";
import { motion } from "motion/react";
import { BsRobot } from "react-icons/bs";
import { IoSparkles } from "react-icons/io5";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../utils/firebase";
import axios from "axios";
import { ServerUrl } from "../App";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

function Auth({ isModel = false }) {
  const dispatch = useDispatch();

  const handleGoogleAuth = async () => {
    try {
      const response = await signInWithPopup(auth, provider);
      console.log(response);
      let User = response.user;
      let name = User.displayName;
      let email = User.email;
      const result = await axios.post(
        ServerUrl + "/api/auth/google",
        { name, email },
        { withCredentials: true },
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
      dispatch(setUserData(null));
    }
  };
  return (
    <div className={`w-full ${!isModel && "min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-100 flex items-center justify-center px-6 py-20"}`}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`w-full mx-auto bg-white border border-gray-200 shadow-2xl overflow-hidden
          ${isModel ? "max-w-md rounded-2xl p-6 sm:p-8" : "max-w-lg rounded-[32px] p-12"}
        `}
      >
        <div className="flex items-center justify-center gap-3 mb-6">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white p-2.5 rounded-xl shadow-md">
            <BsRobot size={18} />
          </div>
          <h2 className="font-semibold text-lg text-gray-800">CareerNexa.AI</h2>
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 text-center leading-snug mb-4">
          Continue with{" "}
          <span className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-full inline-flex items-center gap-2 text-base md:text-lg font-semibold">
            <IoSparkles size={16} className="text-teal-500" />
            AI Smart Interview
          </span>
        </h1>

        <p className="text-sm text-gray-500 text-center text-base leading-relaxed mb-8 max-w-md mx-auto">
          Sign in to start AI-powered mock interviews, track your progress, and
          unlock detailed performance insights.
        </p>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02, y: -1 }}
          whileTap={{ scale: 0.98, y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          onClick={handleGoogleAuth}
          className="w-full flex items-center justify-center gap-3 inline-flex items-center justify-center font-semibold text-sm sm:text-base bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-3 px-6 rounded-2xl shadow-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <FcGoogle size={20} />
          Continue with Google
        </motion.button>
      </motion.div>
    </div>
  );
}

export default Auth;
