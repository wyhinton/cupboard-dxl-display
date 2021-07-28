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
  const editorClass = classNames("editor", {
    "editor-visible": viewModeState === AppMode.EDIT,
  });
  const panelOverlayClass = classNames("panel-overlay", {
    "panel-overlay-visible": minimized,
    "panel-overlay-hidden": !minimized,
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
          <PanelHeader
            onMinimize={() => {
              setMinimized(true);
            }}
            onMaximize={() => {
              setMinimized(false);
            }}
            visible={viewModeState === AppMode.EDIT}
          ></PanelHeader>
          {/* <div
            className={panelOverlayClass}
            onMouseUp={() => setMinimized(false)}
          >
            <div className={"overlay-icon-container"}>
              <FullscreenIcon size={30}></FullscreenIcon>
            </div>
          </div> */}
          <Editor />
        </div>
      </Draggable>
    </>,
    document.querySelector("#editor-panel-container") as HTMLDivElement
  );
};

export default EditorPanel;

// interface PanelHeader{

// }
interface PanelHeaderProperties {
  onMinimize: () => void;
  onMaximize: () => void;
  visible: boolean;
}
const PanelHeader = ({
  onMinimize,
  onMaximize,
  visible,
}: PanelHeaderProperties) => {
  return (
    <div className={"editor-panel-handle panel-header"}>
      {/* <Heading>Editor</Heading> */}
      <WindowButton
        icon={<PlusIcon />}
        color={"yellow"}
        onMouseUp={onMinimize}
      />
      <WindowButton
        icon={<MinusIcon />}
        color={"yellow"}
        onMouseUp={onMaximize}
      />
    </div>
  );
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
  const buttonStyle = {
    width: 20,
    // height: "100%",
    padding: ".25em",
    // borderRadius: 5,
    // backgroundColor: color,
  };
  return (
    <div
      style={buttonStyle}
      onMouseUp={() => {
        onMouseUp;
      }}
    >
      {icon}
    </div>
  );
};
//
