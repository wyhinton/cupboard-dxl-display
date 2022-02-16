import "../../css/clock.css";

import React, { useEffect, useState } from "react";

/**
 * Simple clock widget for displaying the current time.
 * @component
 */
const Clock = (): JSX.Element => {
  const [date, setDate] = useState(new Date());

  const containerStyle = {
    height: "100%",
    padding: ".25em",
    width: "100%",
    // fontSize: "max(4vw, 10px)",
    fontSize: "400%",
    // fontSize: "4vw",
    fontWeight: 600,
    color: "white",
    boxSizing: "border-box",
  } as React.CSSProperties;

  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick(): void {
    setDate(new Date());
  }

  return (
    <div style={containerStyle}>
      <div>Data Experience Lab</div>
      <div>
        {date.toLocaleTimeString("en-IT", { hour12: true, timeStyle: "short" })}
      </div>
    </div>
  );
};

export default Clock;
