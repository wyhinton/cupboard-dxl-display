//TODO: UNIFY MODAL CSS
import "../../css/howToUse.css";
import "../../css/popup.css";

import { motion } from "framer-motion";
import React, { useEffect,useRef, useState } from "react";

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
    <motion.div
      animate={{ y: 0 }}
      className="modal-container"
      style={{
        display: active ? "flex" : "none",
        width: "100vw",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
        // y: -200,
      }}
    >
      <MyBackdrop backdropOpacity={backdropOpacity ?? 0} onClose={onClose} />
      <div className={containerClassName} style={{ zIndex: 1000 }}>
        {children}
      </div>
    </motion.div>
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
      className="pop-up-background"
      onMouseUp={onClose}
      style={{ opacity: backdropOpacity, zIndex: 200 }}
    ></div>
  );
};
