import "../../../../css/table.css";

import React, { useEffect, useState } from "react";

import { DndTypes, DragSource } from "../../../../enums";
import IXDrop from "../../../IXDrop";
import Clock from "../../../Widgets/Clock";
import XDrag from "../../../DraggableRow";
import DraggableDiv from "../../../DraggableDiv";
/**
 * Table for displaying the available card layouts
 * @returns
 */

const WidgetsTab = (): JSX.Element => {
  return (
    <div>
      <IXDrop
        cardType={DndTypes.CLOCK}
        className="table-container"
        droppableId={DragSource.LAYOUT_TABLE}
        isDropDisabled={false}
      >
        <DraggableDiv 
        dndType = {DndTypes.WIDGET}
        isDragDisabled = {false}
        index = {0}
          draggableId={"clock-widget"}
        className={"draggable-widget"} isDragDisabled={false}>
        <Clock />
        <DraggableDiv/>
      </IXDrop>
    </div>
  );
};

export default WidgetsTab;
