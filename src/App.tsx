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
import { ViewMode } from "./enums";
import { SelectMenuItem } from "evergreen-ui";
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
  const fetchSheetData = useStoreActions(
    (actions) => actions.appData.fetchGoogleSheet
  );
  const loadLocalLayouts = useStoreActions(
    (actions) => actions.appData.loadLocalLayouts
  );

  const clearLocalLayouts = useStoreActions(
    (actions) => actions.appData.clearLocalLayouts
  );

  const setAvailableCards = useStoreActions(
    (actions) => actions.appData.setActiveCards
  );
  const manageViewModeChange = useStoreActions(
    (actions) => actions.appData.manageViewModeChange
  );
  const saveLayoutLocal = useStoreActions(
    (actions) => actions.appData.saveLayoutLocal
  );
  const localStorageLayouts = useStoreState(
    (state) => state.appData.localStorageLayouts
  );

  const undoHistory = useStoreActions(
    (actions) => actions.historyData.undoHistory
  );
  const redoHistory = useStoreActions(
    (actions) => actions.historyData.undoHistory
  );

  const [availableLayouts, setAvailableLayouts] = useState(localStorageLayouts);
  // const [localStorageLayouts, setLocalStorageLayouts] = useState(Object.entries<[K in keyof T]: [K, T[K]];>(localStorage).filter(a,[k,v]=>{if k.startsWith("curLayout"){return true}}));
  useEffect(() => {
    fetchSheetData();
    loadLocalLayouts();
  }, []);

  useEffect(() => {
    setAvailableLayouts(localStorageLayouts);
  }, [localStorageLayouts]);

  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };
  const toolbarRowStyle = {
    display: "flex",
    width: "100%",
  };
  return (
    <>
      <Background />
      <Toolbar>
        <span style={toolbarRowStyle}>
          <DropDownMenu
            onSelect={(item) => {
              manageViewModeChange(
                ViewMode[item.label as unknown as keyof typeof ViewMode]
              );
              console.log(item);
            }}
            items={Object.keys(ViewMode).map(
              (k) => ({ label: k, value: k } as SelectMenuItem)
            )}
            title={"View Mode"}
          />
          <DropDownMenu
            onSelect={(item) => {
              console.log(item);

              // console.log(item);
            }}
            items={localStorageLayouts.map((l) => ({
              label: l.name,
              value: l.layout,
            }))}
            title={"Load Layout"}
          />
          <Button
            onClick={() => {
              clearLocalLayouts();
            }}
            text={"Clear Local"}
          ></Button>
          <Button
            onClick={() => {
              console.log("hello");
            }}
            text={"Return"}
          ></Button>
          <Button
            onClick={() => {
              saveLayoutLocal();
            }}
            text={"Save Layout"}
          ></Button>

          <Button
            onClick={() => {
              undoHistory();
            }}
            text={"Undo"}
          ></Button>
          <Button
            onClick={() => {
              redoHistory();
            }}
            text={"Redo"}
          ></Button>
        </span>
        <span style={toolbarRowStyle}>
          <Button
            onClick={() => {
              setAvailableCards(perfTest1Cards);
            }}
            text={"Performance Test 1 - 3D"}
          ></Button>
          <Button
            onClick={() => {
              setAvailableCards(perfTest2Cards);
            }}
            text={"Performance Test 2 - code"}
          ></Button>
          <Button
            onClick={() => {
              setAvailableCards(perfTest3Cards);
            }}
            text={"Performance Test 3 - map"}
          ></Button>
          <Button
            onClick={() => {
              setAvailableCards(perfTest4Cards);
            }}
            text={"Performance Test 4 - d3"}
          ></Button>
        </span>
      </Toolbar>
      <div style={containerStyle}>
        <CardGrid />
      </div>
    </>
  );
}
