import type { ReactElement, ReactNode} from "react";
import React, { FC, useEffect, useRef } from "react";
import type {
  DraggableProps,
  DraggableProvided,
  DraggingStyle} from "react-beautiful-dnd";
import {
  Draggable
} from "react-beautiful-dnd";
import { createPortal } from "react-dom";

import type CardData from "../../data_structs/CardData";
import type { DndTypes } from "../../enums";
import { CardView } from "../../enums";
import IFrameView from "../CardContent";

interface DraggableRowProperties extends Omit<DraggableProps, "children"> {
  dndType: DndTypes;
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
  card: CardData;
}

const useDraggableInPortal = () => {
  const element = useRef<HTMLDivElement>(document.createElement("div")).current;

  useEffect(() => {
    if (element) {
      element.style.pointerEvents = "none";
      element.style.position = "absolute";
      element.style.height = "100%";
      element.style.width = "100%";
      element.style.top = "0";
      // element.style.border = "5px solid red";

      document.body.append(element);

      return () => {
        element.remove();
      };
    }
  }, [element]);

  return (render: (provided: DraggableProvided) => ReactElement) =>
    (provided: DraggableProvided) => {
      const result = render(provided);
      const style = provided.draggableProps.style as DraggingStyle;
      if (style.position === "fixed") {
        return createPortal(result, element);
      }
      return result;
    };
};

/**
 * A draggable table row. Used for dragging card content or layouts into the grid.
 */
const DraggableRow = ({
  dndType,
  className,
  children,
  dragAll,
  card,
  ...properties
}: DraggableRowProperties): JSX.Element => {
  if (!React.isValidElement(children)) return <div />;

  const renderDraggable = useDraggableInPortal();

  return (
    <Draggable {...properties}>
      {(provided, snapshot) => {
        const dragHandleProperties = dragAll ? provided.dragHandleProps : {};
        if (
          snapshot.isDragging &&
          provided &&
          provided.draggableProps &&
          provided.draggableProps.style
        ) {
          //@ts-ignore
          provided.draggableProps.style.left =
            //@ts-ignore
            provided.draggableProps.style.offsetLeft;
          //@ts-ignore
          provided.draggableProps.style.top =
            //@ts-ignore
            provided.draggableProps.style.offsetTop;
        }
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
            {/* {
              //@ts-ignore
              renderDraggable((provided, snapshot) => {
                <IFrameView card={card} scale={1} cardView={CardView.GRID} />;
              })
            } */}
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
