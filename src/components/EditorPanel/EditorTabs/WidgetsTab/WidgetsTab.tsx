import "../../../../css/table.css";
import "../../../../css/viewCard.css";
import "../../../../css/widgetsTab.css";

import { Heading } from "evergreen-ui";
import React, { useEffect, useRef, useState } from "react";
import { Layout, Layouts } from "react-grid-layout";

import WidgetData, { WidgetType } from "../../../../data_structs/WidgetData";
import { DndTypes, DragSource } from "../../../../enums";
import { useLayout, useStoreState, useWindowSize } from "../../../../hooks";
import appConfig from "../../../../static/appConfig";
import DraggableWidget from "../../../DragAndDrop/DraggableWidget";
import IXDrop from "../../../DragAndDrop/IXDrop";
import Clock from "../../../Widgets/Clock";

/**
 * Table for displaying the available card layouts
 */
const WidgetsTab = (): JSX.Element => {
  const { activeLayout } = useLayout();
  const availableWidgets = useStoreState(
    (state) => state.appModel.availableWidgets
  );
  const [scalar, setScalar] = useState(1);
  const { width, height } = useWindowSize();
  const [widgetsToRender, setWidgetsToRender] =
    useState<WidgetData[]>(availableWidgets);
  const [useLayouts, setuseLayouts] = useState<Layouts>({ lg: [] });

  useEffect(() => {
    setWidgetsToRender(
      availableWidgets.filter((w) => !activeLayout?.widgets().includes(w.id))
    );
  }, [availableWidgets]);

  const editorPanelRef = useRef<HTMLDivElement>();

  useEffect(() => {
    editorPanelRef.current = document.getElementById(
      "editor-panel"
    ) as HTMLDivElement;
    console.log(editorPanelRef.current.getBoundingClientRect().width);
    setScalar(editorPanelRef.current.getBoundingClientRect().width / width);
  }, [width]);

  useEffect(() => {
    console.log(scalar);
  }, [scalar]);
  const colWidth = width / appConfig.gridCols;
  const rowHeight = height / appConfig.gridRows;

  const renderWidget = (widgetId: WidgetType) => {
    let widg = null;
    switch (widgetId) {
      case "clock":
        widg = <Clock />;
        break;
      default:
        widg = <Heading>hello</Heading>;
    }

    return widg;
  };

  // const testWidgs =

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {widgetsToRender.length == 0 ? (
        <div>All Widgets in Use</div>
      ) : (
        <IXDrop
          cardType={DndTypes.CLOCK}
          className="widgets-container"
          droppableId={DragSource.WIDGETS_TABLE}
          isDropDisabled={false}
        >
          {widgetsToRender
            .filter((w) => !activeLayout?.widgets().includes(w.id))
            .map((w, i) => {
              return (
                <DraggableWidget
                  className="draggable-widget"
                  dndType={DndTypes.WIDGET}
                  draggableId="clock"
                  index={0}
                  height={scalar * w.h * rowHeight}
                  isDragDisabled={false}
                >
                  <div
                    key={i}
                    className="card-display"
                    style={{
                      // width: width,
                      width: w.w * colWidth,
                      height: w.h * rowHeight,
                      transform: `scale(${scalar})`,
                      transformOrigin: "top left",
                      borderRadius: ".5em",
                      overflow: "hidden",
                    }}
                  >
                    {renderWidget(w.id)}
                  </div>
                </DraggableWidget>
              );
            })}
        </IXDrop>
      )}
    </div>
  );
};

export default WidgetsTab;
