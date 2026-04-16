import React from "react";
import Navbar from "./Navbar";

/**
 * Shared shell: sticky navbar + global gradient + main column.
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col w-full bg-gradient-to-br from-emerald-50 via-white to-teal-100">
      <Navbar />
      <div className="flex-1 flex flex-col w-full min-h-0">{children}</div>
    </div>
  );
}
