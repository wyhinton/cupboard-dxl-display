import React, { useState, useEffect } from "react";

interface FlexRowProps
  extends Omit<React.HTMLProps<HTMLDivElement>, "as" | "ref"> {}

const FlexRow = (props: FlexRowProps): JSX.Element => {
  return (
    <div
      {...props}
      style={{
        ...(props.style || {}),
        display: "flex",
      }}
    ></div>
  );
};
export default FlexRow;
