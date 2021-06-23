import React, { useState, useEffect } from "react";

/**
 * Simple clock widget for displaying the current time.
 * @component
 */
function Clock(): JSX.Element {
  const [date, setDate] = useState(new Date());
  const clockText = {
    margin: 0,
    fontSize: "large",
  };
  const containerStyle = {
    backdropFilter: "blur(4px)",
    height: "100%",
    padding: ".5em",
    width: "100%",
    // textSize:
    fontSize: "48pt",
    fontWeight: 600,
    color: "white",
  } as React.CSSProperties;

  const dividerStyle = {
    height: ".5em",
    backgroundColor: "white",
    width: "100%",
  } as React.CSSProperties;
  //Replaces componentDidMount and componentWillUnmount
  useEffect(() => {
    const timerID = setInterval(() => tick(), 1000);
    return function cleanup() {
      clearInterval(timerID);
    };
  });

  function tick() {
    setDate(new Date());
  }

  return (
    <div style={containerStyle}>
      <div>D.H. HILL</div>
      <div>DATA EXPERIENCE LAB</div>
      <div style={dividerStyle}></div>
      <div>{date.toLocaleTimeString()}.</div>
    </div>
  );
}

export default Clock;
