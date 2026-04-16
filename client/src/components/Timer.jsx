import React from "react";
import { buildStyles, CircularProgressbar } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
function Timer({ timeLeft, totalTime }) {
  const percentage = totalTime ? (timeLeft / totalTime) * 100 : 0;
  return (
    <div className="w-20 h-20">
      <CircularProgressbar
        value={percentage}
        text={`${timeLeft}s`}
        styles={buildStyles({
          textSize: "28px",
          pathColor: timeLeft < 10 ? "red" : "#10b981",
          textColor: "#ef4444",
          trailColor: "#e5e7eb",
        })}
      />
    </div>
  );
}

export default Timer;
