import "../../../../css/table.css";
import "../../../../css/viewCard.css";
import "../../../../css/widgetsTab.css";

import { Heading } from "evergreen-ui";
import React, { useEffect, useRef, useState } from "react";
import { Layout, Layouts } from "react-grid-layout";

import WidgetData, { WidgetType } from "../../../../data_structs/WidgetData";
import { DndTypes, DragSource } from "../../../../enums";
import {
  useApp,
  useLayout,
  useStoreState,
  useWindowSize,
} from "../../../../hooks";
import appConfig from "../../../../static/appConfig";
import DraggableWidget from "../../../DragAndDrop/DraggableWidget";
import IXDrop from "../../../DragAndDrop/IXDrop";
import Clock from "../../../Widgets/Clock";
import HowToUse from "../../../Widgets/HowToUse";
import WidgetRenderer from "../../../Widgets/WidgetRenderer";
import TabPane from "../TabPane";

/**
 * Table for displaying the available card layouts
 */
const WidgetsTab = (): JSX.Element => {
  const { activeLayout, activeWidgets } = useLayout();
  const availableWidgets = useStoreState(
    (state) => state.appModel.availableWidgets
  );
  //
  // const {  } = useApp();

  const [widgetsToRender, setWidgetsToRender] =
    useState<WidgetData[]>(availableWidgets);

  useEffect(() => {
    setWidgetsToRender(
      availableWidgets.filter((w) => !activeLayout?.widgets().includes(w.id))
    );
  }, [availableWidgets, activeLayout, activeWidgets.length]);

  return (
    <TabPane>
      <div
        style={{
          backgroundColor: "#1f1f1f",
          borderRadius: ".5em",
          overflow: "hidden",
          padding: "1em",
        }}
      >
        {widgetsToRender.length == 0 ? (
          <div>All Widgets in Use</div>
        ) : (
          <IXDrop
            cardType={DndTypes.CLOCK}
            className="widgets-container"
            droppableId={DragSource.WIDGETS_TABLE}
            isDropDisabled={false}
          >
            <WidgetWrapper>
              {(scale, colWidth, rowHeight) => {
                return widgetsToRender
                  .filter((w) => !activeLayout?.widgets().includes(w.id))
                  .map((w, i) => {
                    return (
                      <DraggableWidget
                        className="draggable-widget"
                        dndType={DndTypes.WIDGET}
                        draggableId={w.id}
                        height={scale * w.h * rowHeight}
                        index={i}
                        isDragDisabled={false}
                        key={i}
                        id={`widgets-tab-draggable-${w.id}`}
                      >
                        <WidgetRenderer
                          widget={w}
                          scale={scale}
                          colWidth={colWidth}
                          rowHeight={rowHeight}
                        />
                      </DraggableWidget>
                    );
                  });
              }}
            </WidgetWrapper>
          </IXDrop>
        )}
      </div>
    </TabPane>
  );
};

export default WidgetsTab;

const WidgetWrapper = ({
  children,
}: {
  children: (
    scale: number,
    colWidth: number,
    rowHeight: number
  ) => JSX.Element | JSX.Element[];
}): JSX.Element => {
  const editorPanelRef = useRef<HTMLDivElement>();
  const [scalar, setScalar] = useState(1);
  const { width, height } = useWindowSize();

  const colWidth = width / appConfig.gridCols;
  const rowHeight = height / appConfig.gridRows;

  useEffect(() => {
    editorPanelRef.current = document.getElementById(
      "editor-panel"
    ) as HTMLDivElement;
    console.log(editorPanelRef.current.getBoundingClientRect().width);
    setScalar(editorPanelRef.current.getBoundingClientRect().width / width);
  }, [width]);

  return <div>{children(scalar * 1.5, colWidth, rowHeight)}</div>;
};
