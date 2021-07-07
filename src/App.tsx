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
import EditorPanel from "./componets/EditorPanel/EditorPanel";
import type { SwapInfo } from "./model/layoutsModel";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */

const App: FC = () => {
  const toggleViewModeThunk = useStoreActions(
    (actions) => actions.appModel.toggleViewMode
  );

  // useKeyPressEvent("F4", toggleViewModeThunk());

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

  useEffect(() => {
    fetchCardDataGoogleSheetThunk();
    fetchLayoutDataGoogleSheetThunk();
    loadLocalLayoutsAction();
    console.log("fetching data");
  }, []);

  // useEffect(() => {
  //   setAvailableLayouts(localStorageLayouts);
  // }, [localStorageLayouts]);

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
  const onDragEnd = (res: DropResult) => {
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
    swapCardDataAction({
      sourceId: draggableId,
      targetId: destination.droppableId,
    });
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
          {/* <EditorPanel visible={viewModeState === AppMode.EDIT} /> */}
          <div style={containerStyle}>
            <CardGrid />
          </div>
        </DragDropContext>
      </div>
    </>
  );
};

export default App;
