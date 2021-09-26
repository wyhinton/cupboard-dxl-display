import React from "react";
import "../../css/panel.css";
import { AddIcon } from "evergreen-ui";

interface PanelProperties{
    children: JSX.Element | JSX.Element[]
    padding?: string;
    flexDirection?: "column" | "row"; 
    className?: string;

}

const Panel = ({children, className, padding, flexDirection}:PanelProperties): JSX.Element => {
  const panelStyle = {
      padding: padding??"0em",
      flexDirection: flexDirection??"column"
  } as React.CSSProperties

  return (
    <div style = {panelStyle} className={"panel"+ " " + className??""}>
        {children}
    </div>
  );
};

export default Panel;
