import React, { useEffect, useState } from "react";
// import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import "./App.global.css";
import { useStoreState, useStoreActions } from "./hooks";
import CardGrid from "./componets/CardLayout";
export default function App() {
  const [displayText, setDisplayText] = useState({ val: "empty" } as any);
  const fetch_sheet_data = useStoreActions(
    (actions) => actions.appData.fetchGoogleSheet
  );
  const containerStyle = {
    width: "100vw",
  };
  return (
    <div style={containerStyle}>
      <CardGrid />
    </div>
  );
}
