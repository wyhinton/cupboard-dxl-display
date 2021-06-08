import React, { useState, useEffect } from "react";
import CardInfo from "./CardInfo";
import CardData from "../../model/card_model";
import "../../css/viewCard.css";
import { Layout } from "react-grid-layout";
import { ViewMode } from "../../model/enums";
import { useStoreState, useStoreActions } from "../../hooks";

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
  const viewMode = useStoreState((state) => state.appData.viewMode);
  const [backgroundStyle, setBackgroundStyle] = useState({
    backgroundColor: "gray",
  } as React.CSSProperties);

  useEffect(() => {
    const isEditMode = viewMode == ViewMode.EDIT;
    const style = {
      border: isEditMode ? "none" : "1px solid rgba(255, 255, 255, 0.18)",
      borderRadius: 5,
      height: "100%",
      width: "100%",
      overflow: "hidden",
      boxShadow: isEditMode ? "none" : "0 8px 32px 0 rgba(49, 49, 49, 0.37)",
      backgroundColor: isEditMode ? "rgba(0,0,0,0.5)" : "",
    } as React.CSSProperties;
    setBackgroundStyle(style);
  }, [viewMode]);
  return (
    <div
      className={"view-card"}
      style={backgroundStyle}
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
