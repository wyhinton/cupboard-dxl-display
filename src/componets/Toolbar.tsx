import React, { useState } from "react";

const Toolbar = (): JSX.Element => {
  const toolbarStyle = {
    position: "absolute",
    top: 0,
    height: "3em",
    width: "100vw",
    backgroundColor: "white",
  } as React.CSSProperties;

  return <div style={toolbarStyle}>toolbar</div>;
};

export default Toolbar;
