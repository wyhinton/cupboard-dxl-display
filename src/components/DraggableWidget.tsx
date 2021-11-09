import React, { FC, ReactNode, useEffect } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";

import { DndTypes } from "../enums";
import { useStoreState } from "../hooks";

interface DraggableDiv  extends Omit<DraggableProps, "children"> {
  dndType: DndTypes;
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
}

/**
 * A draggable div for wrapping draggable widgets in the editor panel.
 */
const DraggableWidget = ({
  dndType,
  className,
  children,
  dragAll,
  draggableId,
  index, 
  ...properties
}:DraggableDiv ) => {
  const currentLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );
  
  let isInLayout = currentLayoutState?.layout.lg.map(l=>l.i).includes(draggableId)

  useEffect(()=>{
    isInLayout = currentLayoutState?.layout.lg.map(l=>l.i).includes(draggableId)
  },[currentLayoutState])
  console.log(React.isValidElement(children));
  console.log(isInLayout);
  if (!React.isValidElement(children) || isInLayout) return <div />;
  return (
    <Draggable draggableId= {draggableId} index = {index}>
      {(provided, snapshot) => {
        const dragHandleProperties = dragAll ? provided.dragHandleProps : {};

        return (
            <div
              className={className}
              ref={provided.innerRef}
              // style = {{display:isInLayout?"none":""}}
              {...provided.draggableProps}
              {...dragHandleProperties}
            >
              {React.cloneElement(children, { provided })}
            </div>
        );
      }}
    </Draggable>
  );
};


export default DraggableWidget;
