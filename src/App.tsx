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
import { DragSource } from "./enums";
import Pulsar from "./components/Shared/Pulsar";
import ModeChangeButton from "./components/ModeChangeButton";


/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */

const App = (): JSX.Element => {
  const toggleViewModeThunk = useStoreActions(
    (actions) => actions.appModel.toggleViewMode
  );

  const fetchCardDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchAppGoogleSheet
  );
  const swapCardDataAction = useStoreActions(
    (actions) => actions.layoutsModel.swapCardContent
  );
  const cardAddAction = useStoreActions(
    (actions) => actions.layoutsModel.addCard
  );
  const setActiveLayout = useStoreActions(
    (actions) => actions.layoutsModel.setActiveLayout
  );
  const allLayouts = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );

  //F4 TO TRANSITION MODE
  const {enable, disable} = useKeyboardShortcut({
    keyCode: 115,
    action: ()=>{toggleViewModeThunk()},
    disabled: false 
  })
  
  const [isDraggingLayout, setIsDraggingLayout] = useState(false);

  /**On app start make one-time fetch requests */
  useEffect(() => {
    fetchCardDataGoogleSheetThunk();
  }, [fetchCardDataGoogleSheetThunk]);

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
        setIsDraggingLayout(false);
        const newLayout = allLayouts.filter((l) => l.id === draggableId)[0];
        console.log(draggableId);
        console.log(allLayouts);
        console.log(newLayout);
        setActiveLayout(newLayout);
        break;
      default:
        console.log("got unkown drag source");
    }
  };

  return (
    <>
      <div
        tabIndex={0}
      >
        <HowToUse />
        <Background />
        <ModeChangeButton/>
        <DragDropContext
          onBeforeDragStart={(e) => {
            console.log(e);
            const { source } = e;
            if (source.droppableId === DragSource.LAYOUT_TABLE) {
              console.log("setting is dragging layout");
              setIsDraggingLayout(true);
            }
          }}
          onDragEnd={onDragEnd}
        >
          <EditorPanel />
          <div style={containerStyle}>
            {isDraggingLayout ? <LayoutOverlay /> : <></>}
            <DndContext>
              <CardGrid />
            </DndContext>
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default App;

const LayoutOverlay = ({ active }: { active?: boolean }): JSX.Element => {
  return (
    <div className={"layout-overlay-active"}>
      <Pulsar></Pulsar>
    </div>
  );
};
