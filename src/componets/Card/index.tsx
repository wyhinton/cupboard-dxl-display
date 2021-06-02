import React, { useState } from "react";
import CardInfo from "./CardInfo";
import CardData from "../../model/card_model";
import "../../css/viewCard.css";

interface ViewCardProps {
  children: JSX.Element | JSX.Element[];
  data?: CardData;
}
const ViewCard = ({ children, data }: ViewCardProps): JSX.Element => {
  return (
    <div className={"view-card"}>
      <div style={{ height: "85%" }}>
        {children}
        {data ? <CardInfo data={data} /> : ""}
      </div>
    </div>
  );
};

export default ViewCard;
