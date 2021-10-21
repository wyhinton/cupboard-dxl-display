import React, { useEffect, useState } from 'react';
import { AppMode } from '../enums';
import { useStoreState } from '../hooks';
import '../css/background.css';
import classNames from 'classnames';
import BackgroundShader from "./Background/BackgroundShader"
import ReactDOM from 'react-dom';


const Background = (): JSX.Element => {
  const viewMode = useStoreState((state) => state.appModel.appMode);
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundColor: "gray",
  } as React.CSSProperties);
  useEffect(() => {
    const isEditMode = viewMode == AppMode.EDIT;

    const style = {
      position: "absolute",
      height: "100vh",
      width: "100vw",
      top: 0,
      left: 0,
      backgroundColor: isEditMode ? "white" : "gray",
      transition: "background-color 0.5s ease",
    } as React.CSSProperties;
    // console.log(viewMode);
    setBackgroundStyle(style);
  }, [viewMode]);

  const backgroundClass = classNames("background-container",{
    "background-container-display-mode": viewMode == AppMode.DISPLAY,
    "background-container-edit-mode": viewMode == AppMode.EDIT,
  })


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
    <div style={backgroundStyle} className = {backgroundClass} >
      {viewMode === AppMode.EDIT ? (
        <div style={bgFillSolid}></div>
      ) : (
        <div className = "background-container">
        <div className = "shader-container">
        <BackgroundShader/>
        </div>
        <div className = "particle-container">
        {/* <Particles /> */}
        </div>
        </div>
      )}
    </div>,     document.querySelector("#background") as HTMLElement
  );
};

export default Background;
