import React, { useState } from "react";
import CardInfo from "./CardInfo";
import CardData from "../../model/card_model";
import "../../css/viewCard.css";
import { Layout } from "react-grid-layout";

interface ViewCardProps {
  key?: string;
  children: JSX.Element | JSX.Element[];
  dataGrid?: Layout;
  data?: CardData;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
}
const ViewCard = ({
  children,
  dataGrid,
  data,
  onDoubleClick,
}: ViewCardProps): JSX.Element => {
  const iframeStyle = {
    width: "100%",
    pointerEvents: "none",
    // height: "500px",
    height: "100%",
    border: "none",
  } as React.CSSProperties;
  const iframeActive = {
    width: "100%",
    pointerEvents: "none",
    height: "100%",
    border: "5px blue",
  } as React.CSSProperties;

  return (
    <div
      className={"view-card"}
      onDoubleClick={() => {
        onDoubleClick;
      }}
    >
      <div style={{ height: "100%" }} data-grid={dataGrid ?? undefined}>
        <div style={{ height: data ? "85%" : "100%" }}>{children}</div>
        <div style={{ height: data ? "15%" : "0%" }}>
          {data ? <CardInfo data={data} /> : ""}
        </div>
      </div>
    </div>
  );
};

export default ViewCard;
