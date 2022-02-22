import { AnimatePresence, motion } from "framer-motion";
import React from "react";
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
  // console.log(x, y);
  const windowSize = useWindowSize();
  const scale = 0.4;
  return createPortal(
    <>
      <AnimatePresence>
        {visible && (
          <motion.div
            animate={{
              opacity: 1,
              transition: {
                delay: 0.1,
                duration: 0.2,
                ease: "circIn",
              },
            }}
            exit={{ opacity: 0 }}
            style={{
              backgroundColor: "white",
              boxShadow: "0 8px 32px 0 rgba(49, 49, 49, 0.37)",
              width: width ?? windowSize.width * scale,
              height: height ?? windowSize.height * scale,
              position: "absolute",
              x: x,
              y: y,
              transformBox: "view-box",
              transformOrigin: "top left",
              borderRadius: ".5em",
              overflow: "hidden",
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>,

    document.querySelector("#popup-container") as HTMLDivElement
  );
};

export default React.memo(PopOver);
