import React, { FC, ReactNode } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

interface IXDrop extends Omit<DroppableProps, "children"> {
  children: ReactNode;
  className?: string;
}

const XDrop: FC<IXDrop> = ({ children, className, ...props }) => {
  // console.log();

  return (
    <Droppable {...props}>
      {(provided, snapshot) => {
        // console.log(provided);
        return (
          <div
            {...provided.innerRef}
            ref={provided.innerRef}
            className={className}
            //   isDraggingOver={snapshot.isDraggingOver}
          >
            {children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default XDrop;
