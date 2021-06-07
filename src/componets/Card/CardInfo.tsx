import React, { useState } from "react";
import CardData from "../../model/card_model";
/**
 * Formats text from a CardData object, including it's title and source url.
 * @component
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
