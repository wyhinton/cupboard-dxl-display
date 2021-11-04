import React, { FC, ReactNode } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";
import { DndTypes } from "../enums";

interface DraggableDiv  extends Omit<DraggableProps, "children"> {
  dndType: DndTypes;
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
}

/**
 * A draggable div for wrapping draggable widgets in the editor panel.
 */
const DraggableRow = ({
  dndType,
  className,
  children,
  dragAll,
  ...properties
}:DraggableDiv ) => {
  console.log(React.isValidElement(children));
  if (!React.isValidElement(children)) return <div />;
  return (
    <Draggable {...properties}>
      {(provided, snapshot) => {
        const dragHandleProperties = dragAll ? provided.dragHandleProps : {};

        return (
          <>
            <div
              className={className}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...dragHandleProperties}
            >
              {React.cloneElement(children, { provided })}
            </div>
          </>
        );
      }}
    </Draggable>
  );
};

DraggableRow.defaultProps = {
  dragAll: true,
};

export default React.memo(DraggableRow);
