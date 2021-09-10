import React, { useState, useEffect } from "react";
import "../css/clock.css";
/**
 * Simple clock widget for displaying the current time.
 * @component
 */
const Clock = (): JSX.Element => {
  const [date, setDate] = useState(new Date());
  const clockText = {
    margin: 0,
    fontSize: "large",
  };
  const containerStyle = {
    // backdropFilter: "blur(4px)",
    height: "100%",
    padding: ".25em",
    width: "100%",
    fontSize: "5em",
    fontWeight: 600,
    color: "white",
    boxSizing: "border-box",
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
      {/* <div>D.H. Hill</div> */}
      <div>Data Experience Lab</div>
      <div style={dividerStyle}></div>
      <div>{date.toLocaleTimeString('en-IT', {hour12: true, timeStyle: 'short'})}</div>
    </div>
  );
};

export default Clock;
