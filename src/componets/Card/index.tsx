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
/**
 * Wraps card content.
 * @component
 */
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
  const containerStyle = {
    position: "relative",
  };
  return (
    <div
      className={"view-card"}
      onDoubleClick={() => {
        onDoubleClick;
      }}
    >
      <div style={{ height: "100%" }} data-grid={dataGrid ?? undefined}>
        <div style={{ height: data ? "100%" : "100%" }}>{children}</div>
      </div>
      {data ? <CardInfo data={data} /> : ""}
    </div>
  );
};

export default ViewCard;
