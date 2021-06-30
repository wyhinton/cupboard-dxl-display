import React, { FC, ReactNode, useEffect } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";

interface IXDrop extends Omit<DroppableProps, "children"> {
  children: ReactNode;
  className?: string;
}

const IXDrop: FC<IXDrop> = ({ children, className, ...props }) => {
  // console.log();
  useEffect(() => {
    console.log(props);
  }, [props]);
  // console.log(props);
  return (
    <Droppable {...props}>
      {(provided, snapshot) => {
        // console.log(provided);
        return (
          <div
            {...provided.innerRef}
            ref={provided.innerRef}
            className={className}
            // isDraggingOver={snapshot.isDraggingOver}
          >
            {children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default IXDrop;
