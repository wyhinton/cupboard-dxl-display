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

  const {
    activeLayout,
    setBufferLayout,
    activeCards,
    activeWidgets,
    setActiveLayout,
    useNextLayout,
    externalLayouts,
  } = useLayout();

  console.log(externalLayouts[1]);

  const { appMode, toggleAppMode, rotateLayouts } = useApp();

  useInterval(() => {
    if (appMode === AppMode.DISPLAY && rotateLayouts) {
      // setRandomLayout();
      setActiveLayout(externalLayouts[1]);
      setBufferLayout(externalLayouts[1].layout);
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

  console.log(activeWidgets);

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
                widgets={[...activeWidgets]}
                height={height}
                isDraggable={appMode === AppMode.EDIT}
                isResizable={appMode === AppMode.EDIT}
                // layout={JSON.parse(JSON.stringify())}
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
                  console.log("DIONG ON LAYOUT CHANGE");
                  console.log(newLayout);
                  //TODO: FIX
                  if (l.length > 3) {
                    // console.log("WAS GREATER THAN THREE");
                    activeLayout.layout = newLayout;
                  }
                  // activeLayout.layout = newLayout;
                  setBufferLayout(newLayout);
                }}
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
