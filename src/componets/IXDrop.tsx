import React, { FC, ReactNode, useEffect } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";
import { AddIcon } from "evergreen-ui";
import "../css/droppable.css";

interface IXDrop extends Omit<DroppableProps, "children"> {
  children: ReactNode;
  className?: string;
}

const IXDrop: FC<IXDrop> = ({ children, className, ...props }) => {
  // console.log();
  // useEffect(() => {
  //   // console.log(props);
  // }, [props]);
  // console.log(props);

  // const myClass = classNames("droppable", {
  //   "droppable-hovered": snahsp,
  // });
  return (
    <Droppable {...props}>
      {(provided, snapshot) => {
        // console.log(provided);
        return (
          <div
            {...provided.innerRef}
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver ? "droppable-hovered" : "droppable"
            }
            // isDraggingOver={snapshot.isDraggingOver}
          >
            <div
              className={
                snapshot.isDraggingOver
                  ? "droppable-overlay droppable-overlay-visible"
                  : "droppable-overlay droppable-overlay-hidden"
              }
            >
              <AddIcon size={200}></AddIcon>
            </div>
            {children}
            {provided.placeholder}
          </div>
        );
      }}
    </Droppable>
  );
};

export default IXDrop;
