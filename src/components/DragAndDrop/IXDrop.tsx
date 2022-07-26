import "../../css/droppable.css";

import { AddIcon } from "evergreen-ui";
import type { FC, ReactNode } from "react";
import React, { useEffect } from "react";
import type { DroppableProps } from "react-beautiful-dnd";
import { Droppable } from "react-beautiful-dnd";

import type { DndTypes } from "../../enums";
import Pulsar from "../Shared/Pulsar";
interface IXDrop extends Omit<DroppableProps, "children"> {
  children: ReactNode;
  cardType: DndTypes;
  className?: string;
}

/**A droppable container. Wraps child widgets in a react-beautiful-dnd Droppable component, and renders a "+" if a draggable is dragging over the container */
const IXDrop: FC<IXDrop> = ({
  children,
  className,
  cardType,
  ...properties
}) => {
  return (
    <Droppable {...properties} type="DEFAULT">
      {(provided, snapshot) => {
        return (
          <div
            {...provided.innerRef}
            className={
              snapshot.isDraggingOver
                ? "droppable-hovered" + " " + className
                : "droppable" + " " + className
            }
            ref={provided.innerRef}
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
