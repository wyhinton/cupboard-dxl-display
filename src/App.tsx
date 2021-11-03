import React, { useEffect, useState } from "react";
import "./App.global.css";
import "./css/global.css"
import { useStoreActions, useStoreState, useKeyboardShortcut} from "./hooks";
import CardGrid from "./components/CardLayout/CardLayout";
import Background from "./components/Background";
import { DropResult, DragDropContext } from "react-beautiful-dnd";
import { DndContext } from "@dnd-kit/core";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import { CardAddEvent, CardSwapEvent } from "./interfaces/CardEvents";
import { GridPosition } from "./interfaces/GridPosition";
import HowToUse from "./components/HowToUse";
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

  const toggleAppModeThunk = useStoreActions(
    (actions) => actions.appModel.toggleAppMode
  );
  const fetchTopLevelSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchTopLevelSheet
  );
  const swapCardDataAction = useStoreActions(
    (actions) => actions.layoutsModel.swapCardContent
  );
  const cardAddAction = useStoreActions(
    (actions) => actions.layoutsModel.addCard
  );
  const setActiveLayoutAction = useStoreActions(
    (actions) => actions.layoutsModel.setActiveLayout
  );
  const externalLayoutsState = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  const appModeState = useStoreState(
    (state) => state.appModel.appMode
  );

  useEffect(()=>{
    if (appModeState === AppMode.EDIT){
      toggleAppModeThunk()
    }
  },[isIdle])

  /**On app start make one-time fetch requests */
  useEffect(() => {
    fetchTopLevelSheetThunk()
  }, []);


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
            cardAddAction(addEvent);
            console.log("dropped onto an empty card, adding card");
          } else {
            swapCardDataAction({
              sourceId: draggableId,
              targetId: destination.droppableId,
            } as CardSwapEvent);
          }
        }
        break;
      case DragSource.LAYOUT_TABLE:
        console.log("dragged ");
        console.log("dragged from the layout table!");
        const newLayout = externalLayoutsState.filter((l) => l.id === draggableId)[0];
        console.log(draggableId);
        console.log(externalLayoutsState);
        console.log(newLayout);
        setActiveLayoutAction(newLayout);
        break;
      default:
        console.log("got unkown drag source");
    }
  };

  return (
    <>
        <HowToUse />
        <Background />
        <ModeChangeButton/>
        <DragDropContext
          onDragEnd={onDragEnd}
        >
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

