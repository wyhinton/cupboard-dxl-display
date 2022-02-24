import "../../css/clock.css";

import { HandUpIcon } from "evergreen-ui";
import React, { useEffect, useState } from "react";

import { AppMode } from "../../enums";
import { useApp, useToggle } from "../../hooks";
import HowToUsePopUp from "../HowToUse/HowToUsePopUp";
import Button from "../Shared/Button";

/**
 * Simple clock widget for displaying the current time.
 * @component
 */
const HowToUse = (): JSX.Element => {
  const [date, setDate] = useState(new Date());

  const containerStyle = {
    height: "100%",
    // padding: ".25em",
    width: "100%",
    fontSize: "9vmin",
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

  const { appMode } = useApp();

  return (
    <div id="how-to-use-button-widget" style={containerStyle}>
      {/* {appMode === AppMode.DISPLAY && ( */}
      <HowToUsePopUp active={visible} onClose={toggleVisible} />
      {/* )} */}
      {/* {appMode === AppMode.DISPLAY && ( */}
      <Button
        appearance="primary"
        className="how-to-use-button"
        fontSize="xx-large"
        // height="4vh"
        height="100%"
        iconBefore={<HandUpIcon />}
        onClick={toggleVisible}
        // width="35vw"
        text="Learn how to use this display"
        width="100%"
      />
      {/* )} */}
    </div>
  );
};

export default HowToUse;
