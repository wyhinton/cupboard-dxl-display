import React, {
  useState,
  useEffect,
  useRef,
  createRef,
  useLayoutEffect,
} from "react";
import Draggable from "react-draggable";
import ReactDom from "react-dom";
import DragAndDock from "react-drag-and-dock";
import EditorForm from "./EditorForm";
import { Heading } from "evergreen-ui";
import { useStoreState, useStoreActions } from "../../hooks";
import "../../css/editorPanel.css";
import classNames from "classnames";

// https://github.com/goodoldneon/react-drag-and-dock#api

interface EditorPanelProps {
  visible: boolean;
}

const EditorPanel = ({ visible }: EditorPanelProps): JSX.Element => {
  const [minimized, setMinimized] = useState(false);

  const editorPanelClass = classNames("editor-panel", {
    "editor-panel-full": !minimized,
    hidden: !visible,
    "editor-panel-minimized": minimized,
  });
  const editorClass = classNames("editor", {
    "editor-visible": visible,
    // "editor-minimized": minimized,
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
            visible={visible}
          ></PanelHeader>
          <EditorForm />
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
  const editorClass = classNames("panel-header", {
    "panel-header-hidden": visible,
  });
  return (
    <div className={"editor-panel-handle panel-header"}>
      <Heading>Editor</Heading>
      <div onMouseUp={onMinimize} className={"panel-minimize-button"}></div>
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
