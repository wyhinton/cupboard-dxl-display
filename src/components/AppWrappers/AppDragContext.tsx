import React from "react";
import { DragDropContext, DropResult } from "react-beautiful-dnd";

import { DragSource } from "../../enums";
import { useLayout, useStoreState } from "../../hooks";
import { CardAddEvent, CardSwapEvent } from "../../interfaces/CardEvents";
import { GridPosition } from "../../interfaces/GridPosition";

/**
 * Handles all functionality for dragging and dropping content into the layout
 */

const stringToGridPos = (cardId: string): GridPosition => {
  //card id's of empty cards is of "empty_card_[x, y]" format

  const posString = cardId.split("[")[1];
  //x,y]
  const x = Number.parseInt(posString.charAt(0));
  //x
  const y = Number.parseInt(posString.charAt(3));
  //y
  return {
    x: x,
    y: y,
  } as GridPosition;
};

const cardIsEmpty = (cardId: string): boolean => {
  return cardId.startsWith("empty");
};

const AppDragContext = ({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}): JSX.Element => {
  const { addCard, swapCard, setActiveLayout } = useLayout();

  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );

  const onDragEnd = (response: DropResult) => {
    if (response.destination?.droppableId == response.source?.droppableId)
      return;
    const { source, destination, draggableId } = response;
    console.log(
      `dragged from ${draggableId} to ${
        destination?.droppableId
      } current title: ${"yes"}`
    );

    if (!destination) return;
    switch (source.droppableId) {
      case DragSource.CARD_TABLE:
        if (destination.droppableId) {
          if (cardIsEmpty(destination.droppableId)) {
            const cardPos = stringToGridPos(destination.droppableId);
            const addEvent = {
              sourceId: draggableId,
              targetPosition: cardPos,
            } as CardAddEvent;
            addCard(addEvent);
            console.log("dropped onto an empty card, adding card");
          } else {
            swapCard({
              sourceId: draggableId,
              targetId: destination.droppableId,
            } as CardSwapEvent);
          }
        }
        break;
      case DragSource.WIDGETS_TABLE:
        const cardPos = stringToGridPos(destination.droppableId);
        const addEvent = {
          sourceId: draggableId,
          targetPosition: cardPos,
        } as CardAddEvent;
        addCard(addEvent);
        break;
      case DragSource.LAYOUT_TABLE:
        const newLayout = externalLayoutsState.filter(
          (l) => l.id === draggableId
        )[0];
        setActiveLayout(newLayout);
        break;
      default:
        console.log("got unkown drag source");
    }
  };

  return <DragDropContext onDragEnd={onDragEnd}>{children}</DragDropContext>;
};

export default AppDragContext;
