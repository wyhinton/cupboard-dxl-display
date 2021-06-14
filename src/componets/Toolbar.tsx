import React, { useState } from "react";
/**
 * Wraps navigation controls
 * @component
 */
const Toolbar = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const toolbarStyle = {
    position: "absolute",
    bottom: 0,
    height: "4em",
    width: "100vw",
    backgroundColor: "blue",
    zIndex: 1,
    display: "block",
  } as React.CSSProperties;

  return <div style={toolbarStyle}>{children}</div>;
};

export default Toolbar;
