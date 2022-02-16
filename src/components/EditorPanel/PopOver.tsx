import { AnimatePresence, motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { useWindowSize } from "../../hooks";

const PopOver = ({
  x,
  y,
  children,
  visible,
  width,
  height,
}: {
  x: number;
  y: number;
  children: JSX.Element | JSX.Element[];
  visible: boolean;
  width?: number;
  height?: number;
}): JSX.Element => {
  console.log(x, y);
  const windowSize = useWindowSize();
  const scale = 0.4;
  return createPortal(
    <AnimatePresence>
      {visible && (
        //   {visible && (
        <motion.div
          style={{
            backgroundColor: "white",
            boxShadow: "0 8px 32px 0 rgba(49, 49, 49, 0.37)",
            // width: "40vmin",
            // height: "40vmin",
            width: width ?? windowSize.width * scale,
            height: height ?? windowSize.height * scale,
            position: "absolute",
            x: x,
            y: y,
            border: "1px solid red",
            transformBox: "view-box",
            transformOrigin: "top left",
            borderRadius: ".5em",
            overflow: "hidden",
          }}
          animate={{
            opacity: 1,
            transition: {
              delay: 0.1,
              duration: 0.5,
              ease: "circIn",
            },
          }}
          exit={{ opacity: 0 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>,
    document.getElementById("popup-container") as HTMLDivElement
  );
};

export default PopOver;
