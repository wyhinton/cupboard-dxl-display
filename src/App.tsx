import React, { useEffect, FC, useState } from "react";
import "./App.global.css";
import { useStoreState, useStoreActions } from "./hooks";
import CardGrid from "./componets/CardLayout";
import Background from "./componets/Background";
import { AppMode } from "./enums";
import { useKeyPress, useKeyPressEvent } from "react-use";
import {
  DropResult,
  DragDropContext,
  DraggableLocation,
} from "react-beautiful-dnd";
import { DndContext } from "@dnd-kit/core";
import EditorPanel from "./componets/EditorPanel/EditorPanel";
import { CardAddEvent, CardSwapEvent } from "./interfaces/CardEvents";
import { GridPosition } from "./interfaces/GridPosition";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */

const App: FC = () => {
  const toggleViewModeThunk = useStoreActions(
    (actions) => actions.appModel.toggleViewMode
  );

  const fetchCardDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchCardDataGoogleSheet
  );
  const fetchLayoutDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchLayoutDataGoogleSheet
  );
  const loadLocalLayoutsAction = useStoreActions(
    (actions) => actions.appModel.loadLocalLayouts
  );
  const swapCardDataAction = useStoreActions(
    (actions) => actions.layoutsModel.swapCardContent
  );
  const cardAddAction = useStoreActions(
    (actions) => actions.layoutsModel.addCard
  );

  /**On app start make one-time fetch requests */
  useEffect(() => {
    fetchCardDataGoogleSheetThunk();
    fetchLayoutDataGoogleSheetThunk();
    loadLocalLayoutsAction();
    // console.log("fetching data");
  }, []);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

  // const onChange = (
  //   source: DraggableLocation,
  //   destination: DraggableLocation
  // ) => {
  //   if (
  //     destination.droppableId === source.droppableId &&
  //     destination.index === source.index
  //   ) {
  //     return true;
  //   }
  //   return false;
  // };
  const cardIsEmpty = (cardId: string): boolean => {
    return cardId.startsWith("empty");
  };

  const strToGridPos = (cardId: string): GridPosition => {
    //card id's of empty cards is of "empty_card_[x, y]" format
    const posString = cardId.split("[")[1];
    //x,y]
    const x = parseInt(posString.charAt(0));
    //x
    const y = parseInt(posString.charAt(3));
    //y
    return {
      x: x,
      y: y,
    } as GridPosition;
  };

  const onDragEnd = (res: DropResult) => {
    console.log(res);
    console.log("processing drag end");
    if (res.destination?.droppableId == res.source?.droppableId) return;
    console.log(res);
    const { source, destination, draggableId } = res;
    console.log(source, destination, draggableId);
    console.log(
      `dragged from ${draggableId} to ${
        destination?.droppableId
      } current title: ${"yes"}`
    );

    if (!destination) return;
    if (destination.droppableId) {
      if (cardIsEmpty(destination.droppableId)) {
        const cardPos = strToGridPos(destination.droppableId);
        const addEvent = {
          sourceId: draggableId,
          targetPosition: cardPos,
        } as CardAddEvent;
        cardAddAction(addEvent);
        console.log("dropped onto an empty card, adding card");
      } else {
        swapCardDataAction({
          sourceId: draggableId,
          targetId: destination.droppableId,
        } as CardSwapEvent);
      }
    }
  };

  return (
    <>
      <div
        onKeyUp={(e) => {
          // console.log(e);
          // console.log(e.key);
          if (e.key === "F4") {
            toggleViewModeThunk();
          }
        }}
        tabIndex={0}
      >
        <Background />
        <DragDropContext onDragEnd={onDragEnd}>
          <EditorPanel />

          <div style={containerStyle}>
            <DndContext
              onDragStart={(e) => {
                console.log(e);
              }}
              onDragEnd={(e) => {
                const { active, over } = e;
                console.log(event);
                console.log(active);
                console.log(over);
                console.log(e);
              }}
            >
              <CardGrid />
            </DndContext>
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default App;
