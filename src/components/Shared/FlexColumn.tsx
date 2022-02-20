import React, { useState, useEffect } from "react";

interface FlexColumnProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "as" | "ref"> {}

const FlexColumn = (props: FlexColumnProps): JSX.Element => {
  return (
    <div
      {...props}
      style={{
        ...(props.style || {}),
        display: "flex",
        flexDirection: "column",
      }}
    ></div>
  );
};
export default FlexColumn;
