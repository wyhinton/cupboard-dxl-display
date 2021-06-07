import React, { useState, useEffect } from "react";

/**
 * Simple clock widget for displaying the current time.
 * @component
 */
function Clock(): JSX.Element {
  const [date, setDate] = useState(new Date());
  const clockText = {
    fontSize: "xxx-large",
  };
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
    <div>
      <div style={clockText}>D.H. HILL</div>
      <div style={clockText}>DATA EXPERIENCE LAB</div>
      <h2>{date.toLocaleTimeString()}.</h2>
    </div>
  );
}

export default Clock;
