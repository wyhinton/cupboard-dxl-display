import "../../css/clock.css";

import React, { useEffect, useState } from "react";
import Button from "../Shared/Button";
import { HandUpIcon } from "evergreen-ui";
import { useToggle } from "../../hooks";

/**
 * Simple clock widget for displaying the current time.
 * @component
 */
const HowToUse = (): JSX.Element => {
  const [date, setDate] = useState(new Date());

  const containerStyle = {
    height: "100%",
    padding: ".25em",
    width: "100%",
    fontSize: "4vw",
    fontWeight: 600,
    color: "white",
    boxSizing: "border-box",
    backgroundColor: "blue",
  } as React.CSSProperties;

  const [visible, toggleVisible] = useToggle(false);

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
    <div style={containerStyle} id="how-to-use-button-container">
      <Button
        fontSize={"xx-large"}
        height={"5vh"}
        width={"35vw"}
        iconBefore={<HandUpIcon />}
        onClick={toggleVisible}
        appearance="primary"
        text="Learn how to use this display"
        className={"how-to-use-button"}
        containerClass={"custom-button-wrapper"}
      />
    </div>
  );
};

export default HowToUse;
