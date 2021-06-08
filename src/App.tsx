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
import { ViewMode } from "./model/enums";
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
  const fetch_sheet_data = useStoreActions(
    (actions) => actions.appData.fetchGoogleSheet
  );
  const setAvailableCards = useStoreActions(
    (actions) => actions.appData.setActiveCards
  );
  const setViewMode = useStoreActions((actions) => actions.appData.setViewMode);

  useEffect(() => {
    fetch_sheet_data();
  }, []);
  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };
  return (
    <>
      <Background />
      <Toolbar>
        <DropDownMenu
          onSelect={(item) => {
            setViewMode(
              ViewMode[item.label as unknown as keyof typeof ViewMode]
            );
            console.log(item);
          }}
          items={Object.keys(ViewMode)}
          title={"View Mode"}
        />
        <Button
          onClick={() => {
            console.log("hello");
          }}
          text={"Return"}
        ></Button>
        <Button
          onClick={() => {
            console.log("hello");
          }}
          text={"Save Layout"}
        ></Button>
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
      </Toolbar>
      <div style={containerStyle}>
        <CardGrid />
      </div>
    </>
  );
}
