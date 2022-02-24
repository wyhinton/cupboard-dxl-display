import React from "react";

import type { WidgetType } from "../../data_structs/WidgetData";
import type WidgetData from "../../data_structs/WidgetData";
import type { CardSettings } from "../../interfaces/CardSettings";
import Clock from "./Clock";
import HowToUse from "./HowToUse";

const WidgetRenderer = ({
  widget,
  scale,
  colWidth,
  rowHeight,
  cardSettings,
}: {
  widget: WidgetData;
  scale?: number;
  colWidth?: number;
  rowHeight?: number;
  cardSettings?: CardSettings;
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
