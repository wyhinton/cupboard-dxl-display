import React, { useState, useEffect } from "react";
import IXDrop from "../../../IXDrop";
import XDrag from "../../../XDrag";
import { DndTypes, DragSource } from "../../../../enums";
import "../../../../css/table.css";
import Clock from "../../../Widgets/Clock";
/**
 * Table for displaying the available card layouts
 * @returns
 */

const WidgetsTab = (): JSX.Element => {
  return (
    <div>
      <IXDrop
        className={"table-container"}
        droppableId={DragSource.LAYOUT_TABLE}
        isDropDisabled={false}
        cardType={DndTypes.CLOCK}
      > 
      <Clock/>
      
      
      </IXDrop>
    </div>
  );
};

export default WidgetsTab;
