import React, { useState } from "react";
import CardData from "../../model/card_model";
/**
 * This comment _supports_ [Markdown](https://marked.js.org/)
 */
const CardInfo = ({ data }: { data: CardData }): JSX.Element => {
  const containerStyle = {
    backgroundColor: "lightgrey",
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
