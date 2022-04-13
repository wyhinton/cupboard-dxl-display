import "../../css/clock.css";

import { Heading } from "evergreen-ui";
import React, { useEffect, useState } from "react";

/**
 * Simple clock widget for displaying the current time.
 * @component
 */
const Clock = (): JSX.Element => {
  const [date, setDate] = useState(new Date());

  const containerStyle = {
    height: "100%",
    padding: "3vmin",
    overflow: "hidden",
    width: "100%",
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
      <div style={{ color: "white", fontSize: "9vmin" }}>
        Data Experience Lab
      </div>
      <div style={{ color: "white", fontSize: "9vmin" }}>
        {date.toLocaleTimeString("en-IT", { hour12: true, timeStyle: "short" })}
      </div>
    </div>
  );
};

export default Clock;
