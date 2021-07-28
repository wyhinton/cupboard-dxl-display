import React, { FC } from "react";

interface UseTipProps {
  tip: string;
}

const UseTip: FC<UseTipProps> = ({ tip }) => {
  const tipStyle = {
    fontStyle: "italic",
  };
  return <div style={tipStyle}>{tip}</div>;
};

export default UseTip;
