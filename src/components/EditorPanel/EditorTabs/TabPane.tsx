import React, { useEffect, useRef,useState } from "react";

type TabPaneProperties = Omit<React.HTMLProps<HTMLDivElement>, "as" | "ref">

const TabPane = (
  properties: TabPaneProperties
  //   children: JSX.Element | JSX.Element[]
): JSX.Element => {
  return (
    <div
      {...properties}
      style={{
        ...(properties.style || {}),
        width: properties?.style?.width ?? "inherit",
        padding: ".5em",
      }}
    >
      {properties.children}
    </div>
  );
};

export default TabPane;
