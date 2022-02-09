import "./App.global.css";
import "./css/global.css";

import { DndContext } from "@dnd-kit/core";
import React, { useEffect } from "react";
import { useIdle, useInterval } from "react-use";

import Background from "./components/Background";
import CardGrid from "./components/CardLayout/CardLayout";
import AppDragContext from "./components/DragAndDrop/AppDragContext";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import HowToUse from "./components/HowToUse/HowToUse";
import ModeChangeButton from "./components/ModeChangeButton";
import Screen from "./components/Shared/Screen";
import { AppMode } from "./enums";
import { useApp, useEffectOnce, useLayout, useStoreActions } from "./hooks";
import appConfig from "./static/appConfig";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 */

const App = (): JSX.Element => {
  const isIdle = useIdle(appConfig.idleTime, false);

  const fetchTopLevelSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchTopLevelSheet
  );

  const { setRandomLayout, activeLayout } = useLayout();

  useInterval(() => {
    setRandomLayout();
  }, appConfig.rotationDuration);

  const { appMode, toggleAppMode } = useApp();

  useEffect(() => {
    if (appMode === AppMode.EDIT) {
      toggleAppMode();
    }
  }, [isIdle]);

  useEffectOnce(() => {
    fetchTopLevelSheetThunk();
  });

  return (
    <>
      <HowToUse />
      <Background />
      <ModeChangeButton />
      <AppDragContext>
        <EditorPanel />
        <Screen>
          <DndContext>
            <CardGrid />
          </DndContext>
        </Screen>
      </AppDragContext>
    </>
  );
};

export default App;
