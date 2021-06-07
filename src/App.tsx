import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.global.css";
import { useStoreState, useStoreActions } from "./hooks";
import CardGrid from "./componets/CardLayout";
import Toolbar from "./componets/Toolbar";
import Button from "./componets/Button";

/**
 * High level container, the root component. Initial fetch requests to spreadsheets are made here via a useEffect hook.
 * @component
 */
export default function App() {
  const fetch_sheet_data = useStoreActions(
    (actions) => actions.appData.fetchGoogleSheet
  );
  useEffect(() => {
    fetch_sheet_data();
  }, []);
  const containerStyle = {
    width: "100vw",
    height: "100vh",
  };
  return (
    <>
      <Toolbar>
        <Button
          onClick={() => {
            console.log("hello");
          }}
          text={"do something"}
        ></Button>
      </Toolbar>
      <div style={containerStyle}>
        <CardGrid />
      </div>
    </>
  );
}
