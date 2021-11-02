import classNames from 'classnames';
import Draggable from 'react-draggable';
import Editor from './Editor';
import React, { useState } from 'react';
import ReactDom from 'react-dom';
import { AppMode } from '../../enums';
import { useStoreState } from '../../hooks';
import '../../css/editorPanel.css';
import {
  PlusIcon,
  MinusIcon,
} from "evergreen-ui";

/**Draggable panel which contains the editor body, as well as a header bar with a min/max button for resizing the panel. Renders to "editor-panel-container" div in index.html*/

const EditorPanel = ():JSX.Element => {
  const viewModeState = useStoreState((state) => state.appModel.appMode);
  
  const [minimized, setMinimized] = useState(false);

  const editorPanelClass = classNames("editor-panel", {
    "editor-panel-full": !minimized,
    hidden: viewModeState === AppMode.DISPLAY,
    "editor-panel-minimized": minimized,
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
const PanelHeader = ({children }: PanelHeaderProperties): JSX.Element => {
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
