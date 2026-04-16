import React from "react";
export default function PageShell({ children, className = "" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
