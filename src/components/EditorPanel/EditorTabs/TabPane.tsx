import React, { useState, useEffect, useRef } from "react";

interface TabPaneProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "as" | "ref"> {}

const TabPane = (
  properties: TabPaneProps
  //   children: JSX.Element | JSX.Element[]
): JSX.Element => {
  return (
    <div
      {...properties}
      style={{
        ...(properties.style || {}),
        width: "inherit",
        padding: ".5em",
      }}
    >
      {properties.children}
    </div>
  );
};

export default TabPane;
