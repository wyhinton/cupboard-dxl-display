import React, { FC, ReactNode, useEffect } from "react";
import { Droppable, DroppableProps } from "react-beautiful-dnd";
import { AddIcon } from "evergreen-ui";
import "../css/droppable.css";
import Pulsar from "./Shared/Pulsar";
import { DndTypes } from "../enums";
interface IXDrop extends Omit<DroppableProps, "children"> {
  children: ReactNode;
  cardType: DndTypes;
  className?: string;
}

/**A droppable container. Wraps child widgets in a react-beautiful-dnd Droppable component, and renders a "+" if a draggable is dragging over the container */
const IXDrop: FC<IXDrop> = ({ children, className, cardType, ...properties }) => {
  return (
    <Droppable {...properties} type={"DEFAULT"}>
      {(provided, snapshot) => {
        return (
          <div
            {...provided.innerRef}
            ref={provided.innerRef}
            className={
              snapshot.isDraggingOver ? "droppable-hovered" : "droppable"
            }
          >
            <div
              className={
                snapshot.isDraggingOver
                  ? "droppable-overlay droppable-overlay-visible"
                  : "droppable-overlay droppable-overlay-hidden"
              }
            >
              <Pulsar />
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
