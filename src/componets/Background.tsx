import React, { useState, useEffect } from "react";
import Particles from "react-particles-js";
import { useStoreState } from "../hooks";
import { ViewMode } from "../model/enums";
import GridLines from "react-gridlines";
/**
 * Background with particle animation.
 * @component
 */

const Background = (): JSX.Element => {
  const viewMode = useStoreState((state) => state.appData.viewMode);
  const [size, setSize] = useState({
    x: window.innerWidth,
    y: window.innerHeight,
  });

  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundColor: "gray",
  } as React.CSSProperties);
  useEffect(() => {
    const isEditMode = viewMode == ViewMode.EDIT;

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

  return (
    <div style={backgroundStyle}>
      {viewMode === ViewMode.EDIT ? (
        <GridLines
          cellWidth={size.x / 50}
          strokeWidth={2}
          cellWidth2={size.x / 50}
          className="grid-area"
          lineColor="gray"
        />
      ) : (
        <Particles />
      )}
    </div>
  );
};

export default Background;
