import React, { useState, useRef, useEffect } from "react";
//TODO: UNIFY MODAL CSS
import "../../css/howToUse.css";
import "../../css/popup.css";

const Modal = ({
  children,
  active,
  containerClassName,
  onClose,
  backdropOpacity,
}: {
  active: boolean;
  children: JSX.Element | JSX.Element[];

  onClose: () => void;
  backdropOpacity?: number;
  containerClassName?: string;
}): JSX.Element => {
  return (
    <div
      className={"modal-container"}
      style={{
        display: active ? "flex" : "none",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MyBackdrop onClose={onClose} backdropOpacity={backdropOpacity ?? 0} />
      <div style={{ zIndex: 1000 }} className={containerClassName}>
        {children}
      </div>
    </div>
  );
};

export default Modal;

interface BackdropProperties {
  backdropOpacity: number;
  onClose: () => void;
}
const MyBackdrop = ({ onClose, backdropOpacity }: BackdropProperties) => {
  return (
    <div
      onMouseUp={onClose}
      style={{ opacity: backdropOpacity, zIndex: 200 }}
      className={"pop-up-background"}
    ></div>
  );
};
