import React, { useEffect,useState } from "react";

type FlexRowProperties = Omit<React.HTMLProps<HTMLDivElement>, "as" | "ref">

const FlexRow = (properties: FlexRowProperties): JSX.Element => {
  return (
    <div
      {...properties}
      style={{
        ...(properties.style || {}),
        display: "flex",
      }}
    ></div>
  );
};
export default FlexRow;
