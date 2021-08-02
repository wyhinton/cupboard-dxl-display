import React, { useState, FC } from "react";
import Draggable from "react-draggable";
import ReactDom from "react-dom";
import DragAndDock from "react-drag-and-dock";
import Editor from "./Editor";
import {
  Heading,
  FullscreenIcon,
  MinimizeIcon,
  PlusIcon,
  MinusIcon,
} from "evergreen-ui";
import { useStoreState, useStoreActions } from "../../hooks";
import "../../css/editorPanel.css";
import classNames from "classnames";
import { AppMode } from "../../enums";

// https://github.com/goodoldneon/react-drag-and-dock#api

interface EditorPanelProperties {
  visible: boolean;
}

const EditorPanel: FC = () => {
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

  const styles = {
    root: { display: "none !important", border: "5px solid red !important" },
    handle: { display: "none" },
  };
  return ReactDom.createPortal(
    <>
      <Draggable
        handle=".editor-panel-handle"
        defaultClassName={editorPanelClass}
        defaultPosition={{ x: 100, y: 100 }}
      >
        <div className={editorClass}>
          <div className={"header-container"}>
            <PanelHeader visible={viewModeState === AppMode.EDIT}>
              <WindowButton
                icon={<PlusIcon />}
                color={"yellow"}
                onMouseUp={() => {
                  setMinimized(false);
                }}
              />
              <WindowButton
                icon={<MinusIcon />}
                color={"yellow"}
                onMouseUp={() => {
                  setMinimized(true);
                }}
              />
            </PanelHeader>
          </div>
          <div className={"body-container"}>
            <div className={editorBodyClass}>
              <Editor />
            </div>
          </div>
        </div>
      </Draggable>
    </>,
    document.querySelector("#editor-panel-container") as HTMLDivElement
  );
};

export default EditorPanel;

interface PanelHeaderProperties {
  visible: boolean;
  children: JSX.Element | JSX.Element[];
}
const PanelHeader = ({ visible, children }: PanelHeaderProperties) => {
  return <div className={"editor-panel-handle panel-header"}>{children}</div>;
};

const WindowButton = ({
  icon,
  color,
  onMouseUp,
}: {
  icon: JSX.Element;
  color: string;
  onMouseUp: React.MouseEventHandler<HTMLDivElement>;
}) => {
  return (
    <div className={"window-button"} onMouseUp={onMouseUp}>
      {icon}
    </div>
  );
};
//
