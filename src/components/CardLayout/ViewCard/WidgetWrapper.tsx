import React, { useEffect, useRef,useState } from "react";

import type WidgetData from "../../../data_structs/WidgetData";
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
            cardType={DndTypes.CLOCK}
            onClick={() => {}}
            useAnimation={false}
          >
            {(scale) => {
              return <Clock />;
            }}
          </ViewCard>
        );

        break;
      case "info":
        widget = (
          <ViewCard cardType={DndTypes.CLOCK} useAnimation={false}>
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
