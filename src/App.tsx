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
import type { SwapInfo } from "./model/layoutsModel";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */

const App = (): JSX.Element => {
  const viewModeState = useStoreState((state) => state.appModel.appMode);
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

  const fetchCardDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchCardDataGoogleSheet
  );
  const fetchLayoutDataGoogleSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchLayoutDataGoogleSheet
  );
  const loadLocalLayoutsAction = useStoreActions(
    (actions) => actions.appModel.loadLocalLayouts
  );
  const manageViewModeChange = useStoreActions(
    (actions) => actions.appModel.manageViewModeChange
  );
  const localStorageLayouts = useStoreState(
    (state) => state.appModel.localStorageLayouts
  );

  const swapCardDataAction = useStoreActions(
    (actions) => actions.layoutsModel.swapCardContent
  );

  const [availableLayouts, setAvailableLayouts] = useState(localStorageLayouts);
  // const [localStorageLayouts, setLocalStorageLayouts] = useState(Object.entries<[K in keyof T]: [K, T[K]];>(localStorage).filter(a,[k,v]=>{if k.startsWith("curLayout"){return true}}));
  useEffect(() => {
    // fetchLayoutSheetAction();
    fetchCardDataGoogleSheetThunk();
    fetchLayoutDataGoogleSheetThunk();
    // fetchCardsSheetAction();
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
};

export default App;
