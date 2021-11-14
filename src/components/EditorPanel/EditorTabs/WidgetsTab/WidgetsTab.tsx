import "../../../../css/table.css";

import React, { useEffect } from "react";

import { DndTypes, DragSource } from "../../../../enums";
import DraggableDiv from "../../../DraggableWidget";
import IXDrop from "../../../IXDrop";
import Clock from "../../../Widgets/Clock";
import { useStoreState } from "../../../../hooks";
/**
 * Table for displaying the available card layouts
 */

const WidgetsTab = (): JSX.Element => {
  const currentLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );
  


  // console.log("ADDING WIDGET AT LAYOUT DATA", toAdd);
  // console.log(this.layout);
  // const lg = Object.entries(this.layout)[0][1];
  // if (lg.map(l=>l.i).includes(toAdd.id)){
  //   console.log("ADDING A WIDGET THAT'S ALREADY PRESENT");
  // }
  // for (const [k, v] of Object.entries(this.layout)) {
  //   const newItem: Layout = {
  //     x: pos.x,
  //     y: pos.y,
  //     w: 1,
  //     h: 1,
  //     i: toAdd.id,
  //   };
  //   this.layout[k].push(newItem);
  // }
  
  
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
