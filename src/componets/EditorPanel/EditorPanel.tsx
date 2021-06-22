import React, { useState, useEffect } from "react";
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
  const editorClass = classNames("editor", {
    "editor-visible": visible,
    "editor-hidden": visible == false,
    "editor-minimized": minimized,
  });

  return (
    <div className={editorClass}>
      <DragAndDock.Area>
        <DragAndDock.Area.Panel
          title=""
          defaultPosition={{ x: 100, y: 100 }}
          defaultHeight={minimized ? 100 : 500}
          defaultWidth={minimized ? 100 : 500}
        >
          <PanelHeader
            onMinimize={() => {
              setMinimized(!minimized);
            }}
          ></PanelHeader>
          <EditorForm />
        </DragAndDock.Area.Panel>
      </DragAndDock.Area>
    </div>
  );
};

export default EditorPanel;

// interface PanelHeader{

// }
interface PanelHeaderProps {
  onMinimize: () => void;
}
const PanelHeader = ({ onMinimize }: PanelHeaderProps) => {
  return (
    <div className={"handle panel-header"}>
      <Heading>Editor</Heading>
      <div onMouseUp={onMinimize} className={"panel-minimize-button"}></div>
    </div>
  );
};
