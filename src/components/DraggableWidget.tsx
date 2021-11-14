import React, { ReactNode, useEffect } from "react";
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
}:DraggableDiv ): JSX.Element => {
  const currentLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );
  
  let isInLayout = currentLayoutState?.layout.lg.map(l=>l.i).includes(draggableId)

  useEffect(()=>{
    isInLayout = currentLayoutState?.layout.lg.map(l=>l.i).includes(draggableId)

  },[currentLayoutState])
  const getItemStyle = () => ({
    display:isInLayout?"none":"block"

  });

  if (!React.isValidElement(children)) return <div />;
  return (
    <div style = {{display:isInLayout?"none":"block"}}>
    <Draggable draggableId= {draggableId} index = {index}>
      {(provided, snapshot) => {
        console.log(isInLayout);
        return (
            <div
              className={className}
              ref={provided.innerRef}
              style = {getItemStyle()}
              {...provided.draggableProps}
              {...provided.dragHandleProps}
            >
              {React.cloneElement(children, { provided })}
            </div>
        );
      }}
    </Draggable>
    </div>
  );
};


export default DraggableWidget;
