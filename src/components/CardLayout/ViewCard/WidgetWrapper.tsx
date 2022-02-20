import React, { useState, useEffect, useRef } from "react";
import WidgetData from "../../../data_structs/WidgetData";
import { DndTypes } from "../../../enums";
import Clock from "../../Widgets/Clock";
import ViewCard from "./ViewCard";

const WidgetWrapper = ({
  widget,
  scale,
}: {
  widget: WidgetData;
  scale: number;
}): JSX.Element => {
  const renderWidget = (widgetData: WidgetData): JSX.Element => {
    let widget = <div></div>;

    switch (widgetData.id) {
      case "clock":
        widget = (
          <ViewCard
            useAnimation={false}
            cardType={DndTypes.CLOCK}
            onClick={() => {}}
          >
            {(scale) => {
              return <Clock />;
            }}
          </ViewCard>
        );

        break;
      case "info":
        widget = (
          <ViewCard useAnimation={false} cardType={DndTypes.CLOCK}>
            {(scale) => {
              return <div></div>;
            }}
          </ViewCard>
        );
        break;
    }
    // console.log(widget);
    return widget;
  };

  return <>{renderWidget(widget)}</>;
};

export default WidgetWrapper;
