import "../css/howToUse.css";

import classNames from "classnames";
import { HandUpIcon,Heading, InfoSignIcon, Text } from "evergreen-ui";
import React, { useEffect,useRef, useState } from "react";
import ReactDOM from "react-dom";

import { AppMode } from "../enums";
import { useStoreState } from "../hooks";
import { useToggle } from "../hooks";
import Button from "./Shared/Button";
import Modal from "./Shared/Modal";
import Panel from "./Shared/Panel";

const HowToUse = (): JSX.Element => {
  const [visible, toggleVisible] = useToggle(false)
  
  const appModeState = useStoreState((state) => state.appModel.appMode);
  
  return ReactDOM.createPortal(
      <>
        {appModeState === AppMode.DISPLAY ? (
          <div style = {{pointerEvents: "all"}}>
            <HowToPopup
              onClose={toggleVisible}
              active={visible}
            />
            <Button
              fontSize = {"xx-large"}
              height={"4vh"}
              width={"35vw"}
              iconBefore={<HandUpIcon/>}
              onClick={toggleVisible}
              appearance="primary"
              text="Learn how to use this display"
              className = {"how-to-use-button"}
            />
          </div>
        ) : (
          <></>
        )}
         </>, document.querySelector("#how-to-use-button") as HTMLDivElement
  );
};

export default HowToUse;


const HowToPopup = ({
  active,
  onClose,
}: {
  active: boolean;
  onClose: () => void;
}): JSX.Element => {
  return (
    <Modal
      active={active}
      containerClassName={"how-to-use-popup"}
      onClose={onClose}
      backdropOpacity={0}
    >
      <Panel padding = "1em">
      <Heading>Connect Labtop</Heading>
      <hr></hr>
      <Text>
        Connect your labtop to use this screen as a display. 
      </Text>
      <img
        className={"how-to-image"}
        src={process.env.PUBLIC_URL + "/labtopdiagram.png"}
      />
      <Heading>Explore Content</Heading>
      <hr></hr>
      <Text>
        Click on a card to explore data related content.
      </Text>
      <img
        className={"how-to-image"}
        src={process.env.PUBLIC_URL + "/masonary.png"}
      />
      </Panel>
    </Modal>
  );
}; 

