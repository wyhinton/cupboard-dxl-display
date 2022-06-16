import { motion } from "framer-motion";
import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useLongPress } from "react-use";

import { useStoreActions } from "../hooks";
import appConfig from "../static/appConfig";

/**Invisible button in the bottom left corner of the screen. Hold touch/click to toggle app mode */
const ModeChangeButton = (): JSX.Element => {
  const toggleModeAction = useStoreActions(
    (actions) => actions.appModel.toggleAppMode
  );

  const longPressEvent = useLongPress(() => {
    toggleModeAction();
  });

  const modeChangeButtonStyle = {
    position: "absolute",
    width: 50,
    height: 50,
    border: appConfig.showModeSwitchButton ? "1px solid red" : "none",
    bottom: 0,
    left: 0,
    opacity: 0,
  } as React.CSSProperties;

  return ReactDOM.createPortal(
    <motion.div
      style={{ ...modeChangeButtonStyle, backgroundColor: "white" }}
      whileTap={{ backgroundColor: "green", opacity: 1 }}
    >
      <div style={modeChangeButtonStyle} {...longPressEvent}></div>,
    </motion.div>,
    document.querySelector("#mode-change-button") as HTMLElement
  );
};

export default ModeChangeButton;
