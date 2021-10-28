import React, { useState, useRef, useEffect } from "react";
import { InfoSignIcon, Heading, Text } from "evergreen-ui";
import ReactDom from "react-dom";
import "../css/howToUse.css";
import classNames from "classnames";
import { useStoreState } from "../hooks";
import Button from "./Shared/Button";
import { AppMode } from "../enums";
import Modal from "./Shared/Modal";
import Panel from "./Shared/Panel";
import { useToggle } from "../hooks";

const HowToUse = (): JSX.Element => {
  // const [visible, setvisible] = useState(false);
  const [visible, toggleVisible] = useToggle(false)
  
  const appModeState = useStoreState((state) => state.appModel.appMode);

  const howToPopupContainerClass = classNames("how-to-backdrop", {
    "how-to-backdrop-active": visible,
    "how-to-backdrop-inactive": !visible,
  });

  const buttonContainerClass = classNames("how-to-container", {
    "how-to-container-active": appModeState === AppMode.DISPLAY,
    "how-to-container-inactive": appModeState === AppMode.EDIT,
  });

  const container = useRef<HTMLElement | null>(null);

  useEffect(() => {
    container.current = document.querySelector("#how-to-use-popup");
    if (container.current) {
      container.current.style.display = "none";
    }
  }, []);
  useEffect(() => {
    if (container.current) {
      container.current.style.display = visible ? "initial" : "none";
    }
  }, [visible]);


  return (
    <div style={{ zIndex: 10 }} className={howToPopupContainerClass}>
      <div
        style={{ zIndex: 11, backgroundColor: "rgba(255, 0, 0, 0)" }}
        onClick={toggleVisible}
        className={howToPopupContainerClass}
      ></div>
      <div className={buttonContainerClass}>
        {appModeState === AppMode.DISPLAY ? (
          <div>
            <HowToPopup
              onClose={toggleVisible}
              active={visible}
            />
            <Button
              // height={}
              height={"10vh"}
              width={"30vw"}
              iconBefore={<InfoSignIcon></InfoSignIcon>}
              onClick={toggleVisible}
              appearance="primary"
              text="Learn how to use this display"
              className = {"how-to-use-button"}
            />
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
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
  return ReactDom.createPortal(
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
    </Modal>,
    document.querySelector("#how-to-use-popup") as HTMLElement
  );
};
// export default HowToPopup;

// const Modal = ({
//   children,
//   active,
// }: {
//   active: boolean;
//   children: JSX.Element | JSX.Element[];
// }): JSX.Element => {
//   const howToPopupContainerClass = classNames("how-to-popup-container", {
//     "how-to-popup-container-hidden": !active,
//     "how-to-popup-container-display": active,
//   });

//   return <div className={howToPopupContainerClass}>{children}</div>;
// };
