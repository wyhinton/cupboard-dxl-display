import "../../../../css/table.css";

import React from "react";

import { DndTypes, DragSource } from "../../../../enums";
import DraggableDiv from "../../../DraggableDiv";
import IXDrop from "../../../IXDrop";
import Clock from "../../../Widgets/Clock";
/**
 * Table for displaying the available card layouts
 */

const WidgetsTab = (): JSX.Element => {
  return (
    <div>
      <IXDrop
        cardType={DndTypes.CLOCK}
        className="table-container"
        droppableId={DragSource.WIDGETS_TABLE}
        isDropDisabled={false}
      >
        <DraggableDiv 
        className="draggable-widget"
        dndType = {DndTypes.WIDGET}
        draggableId="clock"
        index = {0}
        isDragDisabled = {false}
        >
          <Clock />
        </DraggableDiv>
        <DraggableDiv 
        className="draggable-widget"
        dndType = {DndTypes.WIDGET}
        draggableId="info"
        index = {1}
        isDragDisabled = {false}
        >
          <button>HELLO</button>
        </DraggableDiv>
      </IXDrop>
    </div>
  );
};

export default WidgetsTab;
