import React, { FC, ReactNode } from "react";
import { Draggable, DraggableProps } from "react-beautiful-dnd";
import { DndTypes } from "../enums";

interface DraggableRowProperties  extends Omit<DraggableProps, "children"> {
  dndType: DndTypes;
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
}

/**
 * A draggable table row.
 * @param param0
 * @returns
 */
const DraggableRow = ({
  dndType,
  className,
  children,
  dragAll,
  ...properties
}:DraggableRowProperties ) => {
  // console.log(React.isValidElement(children));
  // console.log(props);
  if (!React.isValidElement(children)) return <div />;
  // const child = React.memo(children, []);
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
