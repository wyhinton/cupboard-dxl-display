import React, { useState } from "react";
import CardData from "../../data_structs/CardData";
/**
 * Formats text from a CardData object, including it's title and source url.
 * @component
 */
const CardInfo = ({
  data,
  className,
}: {
  data: CardData;
  className: string;
}): JSX.Element => {
  const [expanded, setExpanded] = useState(false);

  const titleStyle = {
    fontSize: "large",
  };
  return (
    <>
      <div className={"card-footer"}>
        <div style={titleStyle}>{data.title}</div>
        <a>{data.src}</a>
        <div style={{ display: expanded ? "block" : "none" }}>
          Lorem Ipsum is simply dummy text of the printing and typesetting
          industry. Lorem Ipsum has been the industry&apos standard dummy text
          ever since the 1500s, when an unknown printer took a galley of type
          and scrambled it to make a type specimen book{" "}
        </div>
      </div>
    </>
  );
};

export default CardInfo;
