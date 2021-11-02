import React, { useState, useEffect } from "react";

const FlexRow = ({
  children,
  padding,
}: {
  children: JSX.Element | JSX.Element[];
  padding?: string;
}): JSX.Element => {
  return (
    <div style={{ display: "flex", flexDirection: "row", padding: padding }}>
      {children}
    </div>
  );
};

export default FlexRow;
