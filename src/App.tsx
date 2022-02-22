import "./App.global.css";
import "./css/global.css";

import { DndContext } from "@dnd-kit/core";
import React, { useEffect } from "react";
import { useIdle, useInterval } from "react-use";

import Background from "./components/Background";
import CardLayout from "./components/CardLayout/CardLayout";
import AppDragContext from "./components/AppWrappers/AppDragContext";
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
import Loader from "./components/Loader";
import AppTimers from "./components/AppWrappers/AppTimers";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 */

const App = (): JSX.Element => {
  // const isIdle = useIdle(appConfig.idleTime, false);

  const fetchTopLevelSheetThunk = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchTopLevelSheet
  );

  const {
    activeLayout,
    setBufferLayout,
    activeCards,
    activeWidgets,
    useNextLayout,
    externalLayouts,
  } = useLayout();

  console.log(externalLayouts[1]);
  console.log(activeWidgets);

  const { appMode, toggleAppMode, rotateLayouts, sheetsAreLoaded } = useApp();

  useEffectOnce(() => {
    fetchTopLevelSheetThunk();
  });

  const { width, height } = useWindowSize();

  useEffect(() => {
    console.log(activeWidgets);
  }, [activeWidgets]);
  return (
    <>
      <HowToUse />
      <Background />
      <ModeChangeButton />
      <AppTimers>
        <AppDragContext>
          <Loader visible={sheetsAreLoaded} />
          <EditorPanel />
          <Screen>
            <DndContext>
              {activeLayout && sheetsAreLoaded && (
                <CardLayout
                  appMode={appMode}
                  cols={appConfig.gridCols}
                  rows={appConfig.gridRows}
                  cards={[...activeCards]}
                  height={height}
                  isDraggable={appMode === AppMode.EDIT}
                  isResizable={appMode === AppMode.EDIT}
                  layout={activeLayout.layout}
                  margin={[20, 20]}
                  onLayoutChange={(l) => {
                    const newLayout: Layouts = {
                      lg: l,
                      md: l,
                      sm: l,
                      xs: l,
                      xxs: l,
                    };
                    if (appMode === AppMode.EDIT) {
                      activeLayout.setGridLayout(newLayout);
                    }
                    console.log(l);
                    setBufferLayout(newLayout);
                  }}
                  widgets={[...activeWidgets]}
                  width={width}
                />
              )}
            </DndContext>
          </Screen>
        </AppDragContext>
      </AppTimers>
    </>
  );
};

export default App;
