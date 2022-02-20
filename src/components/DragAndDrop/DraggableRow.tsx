import React, { FC, ReactNode } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";
import { DndTypes } from "../../enums";

interface DraggableRowProperties extends Omit<DraggableProps, "children"> {
  dndType: DndTypes;
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
}

/**
 * A draggable table row. Used for dragging card content or layouts into the grid.
 */
const DraggableRow = ({
  dndType,
  className,
  children,
  dragAll,
  ...properties
}: DraggableRowProperties) => {
  if (!React.isValidElement(children)) return <div />;
  return (
    <Draggable {...properties}>
      {(provided, snapshot) => {
        const dragHandleProperties = dragAll ? provided.dragHandleProps : {};

        return (
          <>
            <tr
              className={className}
              ref={provided.innerRef}
              {...provided.draggableProps}
              {...dragHandleProperties}
            >
              {React.cloneElement(children, { provided })}
            </tr>
            <tr
              style={{
                display: snapshot.isDragging ? "table-row" : "none",
                backgroundColor: snapshot.isDragging ? "green" : "none",
              }}
            >
              {React.cloneElement(children, { provided })}
            </tr>
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
