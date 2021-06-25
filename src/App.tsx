import React, { useEffect, useState } from "react";
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
import type { SwapInfo } from "./model/layouts_model";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */

export default function App() {
  const viewModeState = useStoreState((state) => state.appData.appMode);
  const toggleEditMode = () => {
    switch (viewModeState) {
      case AppMode.DISPLAY:
        manageViewModeChange(AppMode.EDIT);
        break;
      case AppMode.EDIT:
        manageViewModeChange(AppMode.DISPLAY);
        break;
      default:
        console.log("unknown view mode passed to edit toggle");
    }
  };

  useKeyPressEvent("F4", toggleEditMode);

  const fetchCardsSheetAction = useStoreActions(
    (actions) => actions.appData.fetchGoogleSheet
  );
  const fetchLayoutSheetAction = useStoreActions(
    (actions) => actions.layoutsData.fetchLayoutDataGoogleSheet
  );
  const loadLocalLayoutsAction = useStoreActions(
    (actions) => actions.appData.loadLocalLayouts
  );
  const manageViewModeChange = useStoreActions(
    (actions) => actions.appData.manageViewModeChange
  );
  const localStorageLayouts = useStoreState(
    (state) => state.appData.localStorageLayouts
  );

  const swapCardDataAction = useStoreActions(
    (actions) => actions.layoutsData.swapCardContent
  );

  const [availableLayouts, setAvailableLayouts] = useState(localStorageLayouts);
  // const [localStorageLayouts, setLocalStorageLayouts] = useState(Object.entries<[K in keyof T]: [K, T[K]];>(localStorage).filter(a,[k,v]=>{if k.startsWith("curLayout"){return true}}));
  useEffect(() => {
    fetchLayoutSheetAction();
    fetchCardsSheetAction();
    loadLocalLayoutsAction();
  }, []);

  useEffect(() => {
    setAvailableLayouts(localStorageLayouts);
  }, [localStorageLayouts]);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

  const onChange = (
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return true;
    }
    return false;
  };
  // export const deleteTask = (data, { droppableId, index }) => {
  //   data = clone(data);
  //   data.columns[droppableId].taskIds.splice(index, 1);
  //   return data;
  // };
  // /**
  //  *
  //  */
  // export const addTask = (data, { droppableId, index }, taskId) => {
  //   data = clone(data);
  //   data.columns[droppableId].taskIds.splice(index, 0, taskId);
  //   return data;
  // };
  const onDragEnd = (res: DropResult) => {
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
    // swapCardDataAction({
    //   sourceId: draggableId,
    //   targetId: destination.droppableId,
    // });
  };

  return (
    <>
      <Background />
      <DragDropContext onDragEnd={onDragEnd}>
        <EditorPanel visible={viewModeState === AppMode.EDIT} />
        <div style={containerStyle}>
          <CardGrid />
        </div>
      </DragDropContext>
    </>
  );
}
