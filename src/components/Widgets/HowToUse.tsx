import "../../css/clock.css";

import React, { useEffect, useState } from "react";
import Button from "../Shared/Button";
import { HandUpIcon } from "evergreen-ui";
import { useApp, useToggle } from "../../hooks";
import { AppMode } from "../../enums";
import HowToUsePopUp from "../HowToUse/HowToUsePopUp";

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
    <div style={containerStyle} id="how-to-use-button-widget">
      {/* {appMode === AppMode.DISPLAY && ( */}
      <HowToUsePopUp active={visible} onClose={toggleVisible} />
      {/* )} */}
      {/* {appMode === AppMode.DISPLAY && ( */}
      <Button
        appearance="primary"
        className="how-to-use-button"
        fontSize="xx-large"
        // height="4vh"
        iconBefore={<HandUpIcon />}
        onClick={toggleVisible}
        text="Learn how to use this display"
        // width="35vw"
        width="100%"
        height="100%"
      />
      {/* )} */}
    </div>
  );
};

export default HowToUse;
