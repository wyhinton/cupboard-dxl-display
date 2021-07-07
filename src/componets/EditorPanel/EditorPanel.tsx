import React, { useState, FC } from "react";
import Draggable from "react-draggable";
import ReactDom from "react-dom";
import DragAndDock from "react-drag-and-dock";
import Editor from "./Editor";
import { Heading, FullscreenIcon, MinimizeIcon } from "evergreen-ui";
import { useStoreState, useStoreActions } from "../../hooks";
import "../../css/editorPanel.css";
import classNames from "classnames";
import { AppMode } from "../../enums";

// https://github.com/goodoldneon/react-drag-and-dock#api

interface EditorPanelProps {
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
              setMinimized(!minimized);
            }}
            visible={viewModeState === AppMode.EDIT}
          ></PanelHeader>
          <div
            className={panelOverlayClass}
            onMouseUp={() => setMinimized(false)}
          >
            <div className={"overlay-icon-container"}>
              <FullscreenIcon size={30}></FullscreenIcon>
            </div>
          </div>
          <Editor />
        </div>
      </Draggable>
    </>,
    document.getElementById("editor-panel-container") as HTMLDivElement
  );
};

export default EditorPanel;

// interface PanelHeader{

// }
interface PanelHeaderProps {
  onMinimize: () => void;
  visible: boolean;
}
const PanelHeader = ({ onMinimize, visible }: PanelHeaderProps) => {
  return (
    <div className={"editor-panel-handle panel-header"}>
      {/* <Heading>Editor</Heading> */}
      <div onMouseUp={onMinimize} className={"panel-minimize-button"}>
        <MinimizeIcon></MinimizeIcon>
      </div>
    </div>
  );
};

{
  /* <DragAndDock.Provider>
<DragAndDock.Area>
  <DragAndDock.Area.Panel
    styles={styles}
    className={"my panel"}
    title=""
    defaultPosition={{ x: 100, y: 100 }}
    defaultHeight={minimized ? 100 : 500}
    defaultWidth={minimized ? 100 : 500}
  >
    <div className={editorClass} ref={parentRef}>
      <PanelHeader
        onMinimize={() => {
          setMinimized(!minimized);
        }}
        visible={visible}
      ></PanelHeader>
      <EditorForm />
    </div>
  </DragAndDock.Area.Panel>
</DragAndDock.Area>
</DragAndDock.Provider>
</> */
}
