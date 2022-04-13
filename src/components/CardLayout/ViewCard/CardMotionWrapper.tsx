import { motion } from "framer-motion";
import React from "react";

import type CardData from "../../../data_structs/CardData";
import type WidgetData from "../../../data_structs/WidgetData";
import { AppMode } from "../../../enums";
import { useApp } from "../../../hooks";
import { randomNumber } from "../../../utils";

const CardMotionWrapper = ({
  children,
  animation,
  card,
  backgroundColor,
}: {
  card: WidgetData | CardData;
  animation: string;
  children: JSX.Element | JSX.Element[] | undefined;
  backgroundColor: string;
}): JSX.Element => {
  const variants = {
    active: {
      opacity: 1,
      transition: {
        delay: randomNumber(0.4, 0.5),
        duration: 0.5,
      },
    },
    preview: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    none: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    error: {
      backgroundColor: "red",
    },
    loaded: {
      opacity: 1,
      transition: {
        delay: randomNumber(0.4, 0.5),
        duration: 0.5,
      },
      x: 0,
    },
    out: {
      y: randomNumber(-50, -75),
      opacity: 0,
      transition: {
        delay: randomNumber(0.1, 0.5),
        duration: 0.5,
      },
    },
  };

  const { appMode } = useApp();

  return (
    <motion.div
      animate={animation}
      initial={card?.contentType === "widget" ? "loaded" : ""}
      layoutId="viewcard"
      style={{
        // boxShadow: "0 8px 32px 0 rgba(49, 49, 49, 0.37)",
        // border: "1px solid rgba(255, 255, 255, 0.294)",
        // transformOrigin: "center",
        // willChange: "transform",
        // height: "100%",
        // backgroundColor: backgroundColor,
        opacity: appMode === AppMode.DISPLAY ? 0 : 1,
        y: 0,
      }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default CardMotionWrapper;
