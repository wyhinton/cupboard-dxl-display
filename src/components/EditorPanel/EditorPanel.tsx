import React, { useState, FC } from "react";
import Draggable from "react-draggable";
import ReactDom from "react-dom";
import Editor from "./Editor";
import {
  PlusIcon,
  MinusIcon,
} from "evergreen-ui";
import { useStoreState, useStoreActions } from "../../hooks";
import "../../css/editorPanel.css";
import classNames from "classnames";
import { AppMode } from "../../enums";

// https://github.com/goodoldneon/react-drag-and-dock#api


const EditorPanel = ():JSX.Element => {
  const [minimized, setMinimized] = useState(false);
  const viewModeState = useStoreState((state) => state.appModel.appMode);

  const editorPanelClass = classNames("editor-panel", {
    "editor-panel-full": !minimized,
    hidden: viewModeState === AppMode.DISPLAY,
    "editor-panel-minimized": minimized,
  });
  const editorBodyClass = classNames("editor-body", {
    "editor-body-full": !minimized,
    "editor-body-minimized": minimized,
  });
  const editorClass = classNames("editor", {
    "editor-visible": viewModeState === AppMode.EDIT,
  });


  return ReactDom.createPortal(
    <>
      <Draggable
        handle=".editor-panel-handle"
        defaultClassName={editorPanelClass}
        defaultPosition={{ x: 100, y: 100 }}
      >
        <div className={editorClass}>
            <PanelHeader>
              <BarButton
                icon={<PlusIcon />}
                onMouseUp={() => {
                  setMinimized(false);
                }}
              />
              <BarButton
                icon={<MinusIcon />}
                onMouseUp={() => {
                  setMinimized(true);
                }}
              />
            </PanelHeader>
              <Editor />
        </div>
      </Draggable>
    </>,
    document.querySelector("#editor-panel-container") as HTMLDivElement
  );
};

export default EditorPanel;

interface PanelHeaderProperties {
  children: JSX.Element | JSX.Element[];
}
const PanelHeader = ({children }: PanelHeaderProperties) => {
  return <div className={"editor-panel-handle panel-header"}>{children}</div>;
};

const BarButton = ({
  icon,
  onMouseUp,
}: {
  icon: JSX.Element;
  onMouseUp: React.MouseEventHandler<HTMLDivElement>;
}): JSX.Element => {
  return (
    <div className={"window-button"} onMouseUp={onMouseUp}>
      {icon}
    </div>
  );
};
