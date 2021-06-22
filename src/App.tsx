import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.global.css";
import { useStoreState, useStoreActions } from "./hooks";
import CardGrid from "./componets/CardLayout";
import Toolbar from "./componets/Toolbar";
import Button from "./componets/Button";
import Background from "./componets/Background";
import {
  perfTest1Cards,
  perfTest2Cards,
  perfTest3Cards,
  perfTest4Cards,
} from "./static/performance_test_layouts";
import DropDownMenu from "./componets/DropDownMenu";
import { AppMode } from "./enums";
import { SelectMenuItem } from "evergreen-ui";
import EditorPanel from "./componets/EditorPanel/EditorPanel";
import { useKeyPress, useKeyPressEvent } from "react-use";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */

{
  /* <iframe height="265" style="width: 100%;" scrolling="no" title="Leaflet - GeoJSON Point Stress Test" src="https://codepen.io/jangajack/embed/GEYywd?height=265&theme-id=light&default-tab=js,result" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true">
  See the Pen <a href='https://codepen.io/jangajack/embed/GEYywd?height=265&theme-id=light&default-tab=js,result'>Leaflet - GeoJSON Point Stress Test</a> by JS
  (<a href='https://codepen.io/jangajack'>@jangajack</a>) on <a href='https://codepen.io'>CodePen</a>.
</iframe> */
}
export default function App() {
  //F8 KEY CODE
  const f12Pressed = useKeyPress("112");
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

  const fetchSheetData = useStoreActions(
    (actions) => actions.appData.fetchGoogleSheet
  );
  const loadLocalLayouts = useStoreActions(
    (actions) => actions.appData.loadLocalLayouts
  );
  const manageViewModeChange = useStoreActions(
    (actions) => actions.appData.manageViewModeChange
  );
  const localStorageLayouts = useStoreState(
    (state) => state.appData.localStorageLayouts
  );

  const [availableLayouts, setAvailableLayouts] = useState(localStorageLayouts);
  // const [localStorageLayouts, setLocalStorageLayouts] = useState(Object.entries<[K in keyof T]: [K, T[K]];>(localStorage).filter(a,[k,v]=>{if k.startsWith("curLayout"){return true}}));
  useEffect(() => {
    fetchSheetData();
    loadLocalLayouts();
  }, []);

  useEffect(() => {
    console.log(f12Pressed);
  }, [f12Pressed]);

  useEffect(() => {
    setAvailableLayouts(localStorageLayouts);
  }, [localStorageLayouts]);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };

  return (
    <>
      <Background />
      <EditorPanel visible={viewModeState === AppMode.EDIT} />
      <div style={containerStyle}>
        <CardGrid />
      </div>
    </>
  );
}
