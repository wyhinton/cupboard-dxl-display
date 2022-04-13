import "./App.global.css";
import "./css/global.css";

import { DndContext } from "@dnd-kit/core";
<<<<<<< HEAD
import React, { useState } from "react";
=======
import React from "react";
>>>>>>> 1831a28e736b88812ec445c3ac0c774b3b31a111
import type { Layouts } from "react-grid-layout";
import { BrowserRouter } from "react-router-dom";

import AppDragContext from "./components/AppWrappers/AppDragContext";
import AppTimers from "./components/AppWrappers/AppTimers";
import Background from "./components/Background";
import CardLayout from "./components/CardLayout/CardLayout";
import EditorPanel from "./components/EditorPanel/EditorPanel";
import Loader from "./components/Loader";
import ModeChangeButton from "./components/ModeChangeButton";
import Screen from "./components/Shared/Screen";
import { AppMode } from "./enums";
import {
  useApp,
  useEffectOnce,
  useLayout,
  useQuery,
  useSheets,
  useWindowSize,
} from "./hooks";
import LoadingScreen from "./LoadingScreen";
import appConfig from "./static/appConfig";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 */

const Body = (): JSX.Element => {
  const { fetchTopLevelSheet, setUrlSheet } = useSheets();

  const { activeLayout, setBufferLayout, activeCards, activeWidgets } =
    useLayout();
  const { urlQueryLink } = useSheets();

  const { appMode, sheetsAreLoaded } = useApp();

  const query = useQuery();
  useEffectOnce(() => {
    setUrlSheet(query.get("url"));
    const url = query.get("url");
    if (url) {
      fetchTopLevelSheet(url);
    }
  });
  const [searchString, setSearchString] = useState<string>();
  const { width, height } = useWindowSize();

<<<<<<< HEAD
  // ?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vRalMG47cvXmCbEqeIJWn5qwd9bPhHUV16_VN7LuKsv53YQdn9e8XSAzNulXCtP_BIFBTUy0Z5e6KKE/pub?output=csv
=======
  // account?url=https://docs.google.com/spreadsheets/d/e/2PACX-1vRalMG47cvXmCbEqeIJWn5qwd9bPhHUV16_VN7LuKsv53YQdn9e8XSAzNulXCtP_BIFBTUy0Z5e6KKE/pub?output=csv
>>>>>>> 1831a28e736b88812ec445c3ac0c774b3b31a111
  return (
    <>
      <Background />
      <ModeChangeButton />
      <LoadingScreen />
      {sheetsAreLoaded && (
        <AppTimers>
          <AppDragContext>
            <Loader visible={sheetsAreLoaded} />
            <EditorPanel />
            <Screen>
              <DndContext>
                {activeLayout && sheetsAreLoaded && (
                  <CardLayout
                    appMode={appMode}
                    cardSettings={activeLayout.layoutSettings.cardSettings}
                    cards={[...activeCards]}
                    cols={appConfig.gridSettings.gridCols}
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
                      setBufferLayout(newLayout);
                    }}
                    rows={appConfig.gridSettings.gridRows}
                    widgets={[...activeWidgets]}
                    width={width}
                  />
                )}
              </DndContext>
            </Screen>
          </AppDragContext>
        </AppTimers>
      )}
    </>
  );
};

const App = (): JSX.Element => {
  return (
    <BrowserRouter>
      <Body />
    </BrowserRouter>
  );
};

export default App;
