import React, { useState } from "react";
import CardData from "../../model/card_model";

const CardInfo = ({ data }: { data: CardData }): JSX.Element => {
  const containerStyle = {
    backgroundColor: "lightgrey",
    height: "15%",
    padding: ".25em",
  } as React.CSSProperties;
  return (
    <>
      <div style={containerStyle}>
        <div>{data.title}</div>
        <a>{data.src}</a>
        {/* <div>description</div> */}
      </div>
    </>
  );
};

export default CardInfo;
