import React, { useEffect,useState } from "react";

type FlexColumnProperties = Omit<React.HTMLProps<HTMLDivElement>, "as" | "ref">

const FlexColumn = (properties: FlexColumnProperties): JSX.Element => {
  return (
    <div
      {...properties}
      style={{
        ...(properties.style || {}),
        display: "flex",
        flexDirection: "column",
      }}
    ></div>
  );
};
export default FlexColumn;
