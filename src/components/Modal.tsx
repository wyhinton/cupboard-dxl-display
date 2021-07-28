import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { Component } from "evergreen-ui/node_modules/@types/react";
import { OutPortal } from "react-reverse-portal";
import type { HtmlPortalNode } from "react-reverse-portal";
import "../css/modal.css";
import { CardView } from "../enums";

/**
 * Modal popup for displaying cards when in preview mode. Displays on top of the CardLayout, and renders
 * to <div style="z-index: 10" id="portal"></div> in index.html.
 * @component
 */

interface ModalProperties {
  // ref: HTMLDivElement;
  text: string;
  mode?: CardView;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  portal?: HtmlPortalNode<Component<any>>;
}

const Modal = ({ mode, onClick, portal }: ModalProperties): JSX.Element => {
  const [viewMode, setViewMode] = useState(CardView.GRID);
  useEffect(() => {
    console.log("got mode change");
    if (mode) {
      setViewMode(mode);
    }
  }, [mode]);

  return ReactDom.createPortal(
    <>
      <MyBackdrop show={true}>
        <div className={"modal-content-container"} onMouseUp={onClick}>
          {portal ? (
            <OutPortal node={portal}></OutPortal>
          ) : (
            <div className={"modal-no-content"}>no portal</div>
          )}
        </div>
      </MyBackdrop>
    </>,
    document.querySelector("#portal") as HTMLElement
  );
};
export default Modal;

interface BackdropProperties {
  show: boolean;
  children: JSX.Element | JSX.Element[];
}
const MyBackdrop = ({ show, children }: BackdropProperties) => {
  return <div className={"modal-backdrop-active "}>{children}</div>;
};
