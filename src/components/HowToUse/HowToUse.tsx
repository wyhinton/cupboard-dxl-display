import "../../css/howToUse.css";

import classNames from "classnames";
import { HandUpIcon, Heading, InfoSignIcon, Text } from "evergreen-ui";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

import { AppMode } from "../../enums";
import { useApp, useStoreState, useToggle } from "../../hooks";
import Button from "../Shared/Button";
import HowToUsePopUp from "./HowToUsePopUp";

const HowToUse = (): JSX.Element => {
  const [visible, toggleVisible] = useToggle(false);

  const { appMode } = useApp();

  return ReactDOM.createPortal(
    <>
      {appMode === AppMode.DISPLAY && (
        <HowToUsePopUp active={visible} onClose={toggleVisible} />
      )}
      {appMode === AppMode.DISPLAY && (
        <Button
          appearance="primary"
          className="how-to-use-button"
          fontSize="xx-large"
          height="4vh"
          iconBefore={<HandUpIcon />}
          onClick={toggleVisible}
          text="Learn how to use this display"
          width="35vw"
        />
      )}
    </>,
    document.querySelector("#how-to-use-button") as HTMLDivElement
  );
};

export default HowToUse;
