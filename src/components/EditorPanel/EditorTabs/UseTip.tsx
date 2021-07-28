import React, { FC } from "react";

interface UseTipProperties {
  tip: string;
}

const UseTip: FC<UseTipProperties> = ({ tip }) => {
  const tipStyle = {
    fontStyle: "italic",
  };
  return <div style={tipStyle}>{tip}</div>;
};

export default UseTip;
