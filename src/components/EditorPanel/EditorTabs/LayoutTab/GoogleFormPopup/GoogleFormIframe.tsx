import { motion } from "framer-motion";
import React, { useState, useEffect, useRef } from "react";
import { useSheets } from "../../../../../hooks";

const GoogleFormIframe = ({ active }: { active: boolean }): JSX.Element => {
  const { formUrl } = useSheets();

  return (
    <div
      style={{
        width: 500,
        height: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <motion.div
        animate={active ? { opacity: 0 } : {}}
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backgroundColor: "red",
          zIndex: 1,
          top: 0,
          left: 0,
          opacity: 0.5,
          display: "flex",
          alignItems: "center",
          pointerEvents: active ? "none" : "all",
        }}
      >
        <div
          style={{
            width: "50%",
            margin: "auto",
            fontWeight: "bold",
            border: "1px solid white",
            padding: "1em",
            backgroundColor: "white",
            opacity: 1,
          }}
        >
          Press the Copy Layout Button before Submitting New Layout
        </div>
      </motion.div>
      <iframe
        frameBorder={0}
        marginHeight={0}
        marginWidth={0}
        src={formUrl}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      ></iframe>
    </div>
  );
};

export default GoogleFormIframe;
