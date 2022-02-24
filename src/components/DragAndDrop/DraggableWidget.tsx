import type { ReactNode} from "react";
import React, { ReactElement, useEffect, useRef } from "react";
import type {
  DraggableProps} from "react-beautiful-dnd";
import {
  Draggable,
  DraggableProvided,
  DraggingStyle,
} from "react-beautiful-dnd";
import { createPortal } from "react-dom";

import type { DndTypes } from "../../enums";
import { useStoreState } from "../../hooks";

interface DraggableDiv extends Omit<DraggableProps, "children"> {
  dndType: DndTypes;
  className?: string;
  children: ReactNode;
  dragAll?: boolean;
  height?: number;
  id?: string;
}

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
  id,
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

  // const renderDraggable = useDraggableInPortal();

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
                id={id}
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
