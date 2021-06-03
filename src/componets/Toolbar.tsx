import React, { useState } from "react";

const Toolbar = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const toolbarStyle = {
    position: "absolute",
    bottom: 0,
    height: "3em",
    width: "100vw",
    backgroundColor: "blue",
    zIndex: 1,
    display: "flex",
  } as React.CSSProperties;

  return <div style={toolbarStyle}>{children}</div>;
};

export default Toolbar;
