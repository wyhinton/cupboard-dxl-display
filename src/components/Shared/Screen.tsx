import React, { useState, useEffect } from "react";

const Screen = ({
  children,
  padding,
}: {
  children: JSX.Element | JSX.Element[];
  padding?: string;
}): JSX.Element => {
  return (
    <div style={{width: "100vw", height: "100vh"}}>
      {children}
    </div>
  );
};

export default Screen;
