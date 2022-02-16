import "./App.global.css";
import "./css/global.css";

import { DndContext } from "@dnd-kit/core";
import React, { useEffect } from "react";
import { useIdle, useInterval } from "react-use";

import Background from "./components/Background";
import CardLayout from "./components/CardLayout/CardLayout";
import AppDragContext from "./components/DragAndDrop/AppDragContext";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import HowToUse from "./components/HowToUse/HowToUse";
import ModeChangeButton from "./components/ModeChangeButton";
import Screen from "./components/Shared/Screen";
import { AppMode } from "./enums";
import {
  useApp,
  useEffectOnce,
  useLayout,
  useStoreActions,
  useWindowSize,
} from "./hooks";
import appConfig from "./static/appConfig";
import { Layouts } from "react-grid-layout";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 */

const App = (): JSX.Element => {
  const isIdle = useIdle(appConfig.idleTime, false);

  const fetchTopLevelSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchTopLevelSheet
  );

  const { activeLayout, setBufferLayout, activeCards, activeWidgets } =
    useLayout();

  const { appMode, toggleAppMode, rotateLayouts } = useApp();

  useInterval(() => {
    if (appMode === AppMode.DISPLAY && rotateLayouts) {
      // setRandomLayout();
    }
  }, appConfig.rotationDuration);

  useEffect(() => {
    if (appMode === AppMode.EDIT) {
      toggleAppMode();
    }
  }, [isIdle]);

  useEffectOnce(() => {
    fetchTopLevelSheetThunk();
  });

  // const { activeLayout, setBufferLayout, activeCards, activeWidgets } =
  useLayout();

  const { width, height } = useWindowSize();
  return (
    <>
      <HowToUse />
      <Background />
      <ModeChangeButton />
      <AppDragContext>
        <EditorPanel />
        <Screen>
          <DndContext>
            {activeLayout && (
              <CardLayout
                appMode={appMode}
                cards={[...activeCards]}
                height={height}
                isDraggable={appMode === AppMode.EDIT}
                isResizable={appMode === AppMode.EDIT}
                layout={activeLayout}
                margin={[20, 20]}
                onLayoutChange={(l) => {
                  const newLayout: Layouts = {
                    lg: l,
                    md: l,
                    sm: l,
                    xs: l,
                    xxs: l,
                  };
                  console.log(newLayout);
                  if (l.length > 3) {
                    activeLayout.layout = newLayout;
                  }

                  setBufferLayout(newLayout);
                }}
                widgets={[...activeWidgets]}
                width={width}
              />
            )}
          </DndContext>
        </Screen>
      </AppDragContext>
    </>
  );
};

export default App;
