import React from "react";
import { BsRobot } from "react-icons/bs";

function Footer() {
  return (
    <footer className="flex justify-center px-4 pb-10 pt-6">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-3">
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 text-white p-2 rounded-xl shadow-sm">
              <BsRobot size={16} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">CareerNexa.AI</h2>
          </div>
          <p className="text-sm text-gray-500 max-w-xl mx-auto leading-relaxed">
            AI-powered interview preparation platform designed to improve
            communication skills, technical depth and professional confidence.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
