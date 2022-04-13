import "../../css/editorPanel.css";

import classNames from "classnames";
import { MinusIcon, PlusIcon } from "evergreen-ui";
import React, { useState } from "react";
import ReactDom from "react-dom";
import Draggable from "react-draggable";

import { AppMode } from "../../enums";
import { useApp, useStoreState } from "../../hooks";
import EditorTabs from "./EditorTabs/EditorTabs";
import SettingsMenu from "./SettingsMenu";

/**Draggable panel which contains the editor body, as well as a header bar with a min/max button for resizing the panel. Renders to "editor-panel-container" div in index.html*/

const EditorPanel = (): JSX.Element => {
  const { appMode, editingCard } = useApp();

  const [minimized, setMinimized] = useState(false);

  const editorPanelClass = classNames("editor-panel", {
    "editor-panel-full": !minimized,
    hidden: appMode === AppMode.DISPLAY,
    "editor-panel-minimized": minimized,
  });
  const editorClass = classNames("editor", {
    "editor-visible": appMode === AppMode.EDIT,
  });

  return ReactDom.createPortal(
    <Draggable
      bounds={{
        left: 0,
        top: 0,
        right: window.innerWidth - 50,
        bottom: window.innerHeight - 50,
      }}
      defaultClassName={editorPanelClass}
      defaultPosition={{ x: 100, y: 100 }}
      handle=".editor-panel-handle"
    >
      <div className={editorClass} id="editor-panel">
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
        {editingCard && <SettingsMenu card={editingCard} />}
        <EditorTabs />
      </div>
    </Draggable>,
    document.querySelector("#editor-panel-container") as HTMLDivElement
  );
};

export default React.memo(EditorPanel);

interface PanelHeaderProperties {
  children: JSX.Element | JSX.Element[];
}
const PanelHeader = ({ children }: PanelHeaderProperties): JSX.Element => {
  return <div className="editor-panel-handle panel-header">{children}</div>;
};

const BarButton = ({
  icon,
  onMouseUp,
}: {
  icon: JSX.Element;
  onMouseUp: React.MouseEventHandler<HTMLDivElement>;
}): JSX.Element => {
  return (
    <div className="window-button" onMouseUp={onMouseUp}>
      {icon}
    </div>
  );
};
