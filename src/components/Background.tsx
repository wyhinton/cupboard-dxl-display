import "../css/background.css";

import classNames from "classnames";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

import { AppMode } from "../enums";
import { useApp } from "../hooks";
import BackgroundShader from "./Background/BackgroundShader";

const Background = (): JSX.Element => {
  const { appMode } = useApp();

  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundColor: "gray",
  } as React.CSSProperties);
  useEffect(() => {
    const style = {
      position: "absolute",
      height: "100vh",
      width: "100vw",
      top: 0,
      left: 0,
      backgroundColor: appMode === AppMode.EDIT ? "#2d2d2d" : "gray",
      transition: "background-color 0.5s ease",
    } as React.CSSProperties;
    setBackgroundStyle(style);
  }, [appMode]);

  const backgroundClass = classNames("background-container", {
    "background-container-display-mode": appMode == AppMode.DISPLAY,
    "background-container-edit-mode": appMode == AppMode.EDIT,
  });

  const bgFillSolid = {
    position: "absolute",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    backgroundColor: "lightgrey",
    transition: "background-color 0.5s ease",
  } as React.CSSProperties;

  return ReactDOM.createPortal(
    <div className={backgroundClass} style={backgroundStyle}>
      {appMode === AppMode.EDIT ? (
        <div style={bgFillSolid}></div>
      ) : (
        <div className="background-container">
          <div className="shader-container">
            <BackgroundShader />
          </div>
          <div className="particle-container"></div>
        </div>
      )}
    </div>,
    document.querySelector("#background") as HTMLElement
  );
};

export default React.memo(Background);
