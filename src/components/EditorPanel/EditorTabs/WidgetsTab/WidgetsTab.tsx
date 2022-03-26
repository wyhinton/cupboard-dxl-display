import "../../../../css/table.css";
import "../../../../css/viewCard.css";
import "../../../../css/widgetsTab.css";

import { Heading } from "evergreen-ui";
import React, { useEffect, useRef, useState } from "react";
import { Layout, Layouts } from "react-grid-layout";

import type WidgetData from "../../../../data_structs/WidgetData";
import { WidgetType } from "../../../../data_structs/WidgetData";
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
        {widgetsToRender.length === 0 ? (
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
                  .map((w, index) => {
                    return (
                      <DraggableWidget
                        className="draggable-widget"
                        dndType={DndTypes.WIDGET}
                        draggableId={w.id}
                        height={scale * w.h * rowHeight}
                        id={`widgets-tab-draggable-${w.id}`}
                        index={index}
                        isDragDisabled={false}
                        key={index}
                      >
                        <WidgetRenderer
                          colWidth={colWidth}
                          rowHeight={rowHeight}
                          scale={scale}
                          widget={w}
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
  const editorPanelReference = useRef<HTMLDivElement>();
  const [scalar, setScalar] = useState(1);
  const { width, height } = useWindowSize();

  const colWidth = width / appConfig.gridSettings.gridCols;
  const rowHeight = height / appConfig.gridSettings.gridRows;

  useEffect(() => {
    editorPanelReference.current = document.querySelector(
      "#editor-panel"
    ) as HTMLDivElement;
    console.log(editorPanelReference.current.getBoundingClientRect().width);
    setScalar(
      editorPanelReference.current.getBoundingClientRect().width / width
    );
  }, [width]);

  return <div>{children(scalar * 1.5, colWidth, rowHeight)}</div>;
};
