import React, { useEffect } from "react";
import "./App.global.css";
import { useStoreActions } from "./hooks";
import CardGrid from "./components/CardLayout";
import Background from "./components/Background";
import { DropResult, DragDropContext } from "react-beautiful-dnd";
import { DndContext } from "@dnd-kit/core";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import { CardAddEvent, CardSwapEvent } from "./interfaces/CardEvents";
import { GridPosition } from "./interfaces/GridPosition";
import HowToUse from "./components/HowToUse";
import { DragSource } from "./enums";
/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */

const App = (): JSX.Element => {
  const toggleViewModeThunk = useStoreActions(
    (actions) => actions.appModel.toggleViewMode
  );

  const fetchCardDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchCardDataGoogleSheet
  );
  const fetchLayoutDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchLayoutDataGoogleSheet
  );
  // const loadLocalLayoutsAction = useStoreActions(
  //   (actions) => actions.appModel.loadLocalLayouts
  // );
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
    // loadLocalLayoutsAction();
    // console.log("fetching data");
  }, [fetchCardDataGoogleSheetThunk, fetchLayoutDataGoogleSheetThunk]);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

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
    console.log(response);
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
        console.log("dragged from the layout table!");
        break;
      default:
        console.log("got unkown drag source");
    }
  };

  return (
    <>
      <div
        onKeyUp={(event) => {
          if (event.key === "F4") {
            toggleViewModeThunk();
          }
        }}
        tabIndex={0}
      >
        <HowToUse />
        <Background />
        <DragDropContext onDragEnd={onDragEnd}>
          <EditorPanel />

          <div style={containerStyle}>
            <DndContext
              // onDragStart={(e) => {
              //   console.log(e);
              // }}
              onDragEnd={(event) => {
                const { active, over } = event;
                console.log(event);
                console.log(active);
                console.log(over);
                // console.log(e);
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
