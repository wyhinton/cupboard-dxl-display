import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.global.css";
import { useStoreState, useStoreActions } from "./hooks";
import CardGrid from "./componets/CardLayout";
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
    <div style={containerStyle}>
      <CardGrid />
    </div>
  );
}
