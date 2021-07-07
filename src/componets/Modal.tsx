import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { Button as EverGreenButton } from "evergreen-ui";
import { Component } from "evergreen-ui/node_modules/@types/react";
import { createHtmlPortalNode, OutPortal } from "react-reverse-portal";
import type { HtmlPortalNode } from "react-reverse-portal";
import { setTimeout } from "timers";
import "../css/modal.css";
import { CardView } from "../enums";
import classNames from "classnames";

/**
 * Wraps an Evergreen UI Button.
 * @component
 */

interface ModalProps {
  // ref: HTMLDivElement;
  text: string;
  mode?: CardView;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  portal?: HtmlPortalNode<Component<any>>;
}

const Modal = ({ mode, onClick, portal }: ModalProps): JSX.Element => {
  const [viewMode, setViewMode] = useState(CardView.NORMAL);
  useEffect(() => {
    console.log("got mode change");
    if (mode) {
      setViewMode(mode);
    }
  }, [mode]);

  // const cardClass = classNames("modal", {
  //   "modal-full-screen": viewMode === CardView.FULL_SCREEN,
  //   "
  // modal-preview": viewMode === CardView.PREVIEW,
  // });

  return ReactDom.createPortal(
    <>
      <MyBackdrop show={true}>
        <div
          className={"modal-content-container"}
          onMouseUp={onClick}
          // className={cardClass}
        >
          {portal ? (
            <OutPortal node={portal}></OutPortal>
          ) : (
            <div className={"modal-no-content"}>no portal</div>
          )}
        </div>
      </MyBackdrop>
    </>,
    document.getElementById("portal") as HTMLElement
  );
};
export default Modal;

interface BackdropProps {
  show: boolean;
  children: JSX.Element | JSX.Element[];
}
const MyBackdrop = ({ show, children }: BackdropProps) => {
  return <div className={"modal-backdrop-active "}>{children}</div>;
};
