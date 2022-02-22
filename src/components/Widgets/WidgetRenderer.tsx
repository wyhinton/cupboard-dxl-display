import React from "react";

import WidgetData, { WidgetType } from "../../data_structs/WidgetData";
import Clock from "./Clock";
import HowToUse from "./HowToUse";

const WidgetRenderer = ({
  widget,
  scale,
  colWidth,
  rowHeight,
}: {
  widget: WidgetData;
  scale?: number;
  colWidth?: number;
  rowHeight?: number;
}): JSX.Element => {
  const renderWidget = (widgetId: WidgetType) => {
    let widg = <div></div>;
    switch (widgetId) {
      case "clock":
        widg = <Clock />;
        break;
      case "info":
        widg = <HowToUse />;
        break;
      default:
        widg = <div></div>;
    }

    return widg;
  };

  return (
    <div
      className="card-display"
      style={{
        width: colWidth ? widget.w * colWidth : "100%",
        height: rowHeight ? widget.h * rowHeight : "100%",
        transform: `scale(${scale})`,
        transformOrigin: "top left",
        borderRadius: ".5em",
        overflow: "hidden",
      }}
    >
      {renderWidget(widget.id)}
    </div>
  );
};

export default WidgetRenderer;
