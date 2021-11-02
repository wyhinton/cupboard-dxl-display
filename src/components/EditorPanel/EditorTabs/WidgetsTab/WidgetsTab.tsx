import "../../../../css/table.css";

import React, { useEffect, useState } from "react";

import { DndTypes, DragSource } from "../../../../enums";
import IXDrop from "../../../IXDrop";
import Clock from "../../../Widgets/Clock";
import XDrag from "../../../XDrag";
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
        <Clock />
      </IXDrop>
    </div>
  );
};

export default WidgetsTab;
