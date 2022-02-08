import React, { useEffect, useState } from "react";
import "./App.global.css";
import "./css/global.css";
import {
  useStoreActions,
  useStoreState,
  useKeyboardShortcut,
  useApp,
  useLayout,
  useEffectOnce,
} from "./hooks";
import CardGrid from "./components/CardLayout/CardLayout";
import Background from "./components/Background";
import { DropResult, DragDropContext } from "react-beautiful-dnd";
import { DndContext } from "@dnd-kit/core";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import { CardAddEvent, CardSwapEvent } from "./interfaces/CardEvents";
import { GridPosition } from "./interfaces/GridPosition";
import HowToUse from "./components/HowToUse/HowToUse";
import { AppMode, DragSource } from "./enums";
import Screen from "./components/Shared/Screen";
import ModeChangeButton from "./components/ModeChangeButton";
import { useIdle } from "react-use";
import appConfig from "./static/appConfig";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 */

const App = (): JSX.Element => {
  const isIdle = useIdle(appConfig.idleTime, false);

  const fetchTopLevelSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchTopLevelSheet
  );

  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );

  const { appMode, toggleAppMode } = useApp();
  const { addCard, swapCard, addWidget, setActiveLayout } = useLayout();

  useEffect(() => {
    if (appMode === AppMode.EDIT) {
      toggleAppMode();
    }
  }, [isIdle]);

  useEffectOnce(() => {
    fetchTopLevelSheetThunk();
  });

  const cardIsEmpty = (cardId: string): boolean => {
    return cardId.startsWith("empty");
  };

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

  const onDragEnd = (response: DropResult) => {
    console.log("processing drag end");
    if (response.destination?.droppableId == response.source?.droppableId)
      return;
    console.log(response);
    const { source, destination, draggableId } = response;
    console.log(source, destination, draggableId);
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
        console.log(draggableId);
        console.log(destination.droppableId);
        console.log("DRAGGING FROM WIDGETS TABLE");
        const cardPos = stringToGridPos(destination.droppableId);
        const addEvent = {
          sourceId: draggableId,
          targetPosition: cardPos,
        } as CardAddEvent;
        addWidget(addEvent);
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

  return (
    <>
      <HowToUse />
      <Background />
      <ModeChangeButton />
      <DragDropContext onDragEnd={onDragEnd}>
        <EditorPanel />
        <Screen>
          <DndContext>
            <CardGrid />
          </DndContext>
        </Screen>
      </DragDropContext>
    </>
  );
};

export default App;
