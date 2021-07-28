import React, { useState, useEffect } from "react";
import Particles from "react-particles-js";
import { useStoreState } from "../hooks";
import { AppMode } from "../enums";
import GridLines from "react-gridlines";
/**
 * Background with particle animation.
 * @component
 */

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
  const bgFillSolid = {
    position: "absolute",
    height: "100vh",
    width: "100vw",
    top: 0,
    left: 0,
    backgroundColor: "lightgrey",
    transition: "background-color 0.5s ease",
  } as React.CSSProperties;
  return (
    <div style={backgroundStyle}>
      {viewMode === AppMode.EDIT ? (
        <div style={bgFillSolid}></div>
      ) : (
        // <GridLines
        //   cellWidth={size.x / 50}
        //   strokeWidth={2}
        //   cellWidth2={size.x / 50}
        //   className="grid-area"
        //   lineColor="gray"
        // />
        <Particles />
      )}
    </div>
  );
};

export default Background;
