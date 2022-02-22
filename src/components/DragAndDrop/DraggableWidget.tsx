import React, { ReactElement, ReactNode, useEffect, useRef } from "react";
import {
  Draggable,
  DraggableProps,
  DraggableProvided,
  DraggingStyle,
} from "react-beautiful-dnd";
import { createPortal } from "react-dom";

import { DndTypes } from "../../enums";
import { useStoreState } from "../../hooks";

interface DraggableDiv extends Omit<DraggableProps, "children"> {
  dndType: DndTypes;
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
  height?: number;
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
      element.style.border = "5px solid red";

      document.body.appendChild(element);

      return () => {
        document.body.removeChild(element);
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
 * A draggable div for wrapping draggable widgets in the editor panel.
 */
const DraggableWidget = ({
  dndType,
  className,
  children,
  dragAll,
  draggableId,
  index,
  height,
}: DraggableDiv): JSX.Element => {
  const currentLayoutState = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );

  let isInLayout = currentLayoutState?.layout.lg
    .map((l) => l.i)
    .includes(draggableId);

  useEffect(() => {
    isInLayout = currentLayoutState?.layout.lg
      .map((l) => l.i)
      .includes(draggableId);
  }, [currentLayoutState]);
  const getItemStyle = () => ({
    display: isInLayout ? "none" : "block",
  });

  const renderDraggable = useDraggableInPortal();

  if (!React.isValidElement(children)) return <div />;
  return (
    <div
      style={{
        display: isInLayout ? "block" : "block",
        height: height ?? "",
      }}
    >
      {/* <div style={{ display: isInLayout ? "none" : "block" }}> */}
      <Draggable draggableId={draggableId} index={index}>
        {
          //@ts-ignore
          (provided, snapshot) => {
            // renderDraggable((provided, snapshot) => {
            console.log(isInLayout);
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
              <div
                className={className}
                ref={provided.innerRef}
                // style={getItemStyle()}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
              >
                {React.cloneElement(children, { provided })}
              </div>
            );
          }
        }
      </Draggable>
    </div>
  );
};

export default DraggableWidget;
