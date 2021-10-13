import React, { useState } from "react";
import ReactDOM from "react-dom";
import { useStoreActions } from "../hooks";
const ModeChangeButton = (): JSX.Element => {
  const toggleModeAction = useStoreActions((actions)=>actions.appModel.toggleViewMode)

  const modeChangeButtonStyle = {
      position: "absolute",
      width: 50, 
      height: 50, 
      border: "1px solid red",
      bottom: 0,
      left: 0, 
  } as React.CSSProperties
  return ReactDOM.createPortal(
    <div style ={modeChangeButtonStyle} onMouseUp={()=>{toggleModeAction()}}>
    </div>, document.querySelector("#mode-change-button") as HTMLElement
  );
};

export default ModeChangeButton;
