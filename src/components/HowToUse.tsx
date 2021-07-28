import React, { useState, useRef, useEffect, FC } from "react";
import { InfoSignIcon } from "evergreen-ui";
import ReactDom from "react-dom";
import "../css/howToUse.css";
import classNames from "classnames";
// import { useStoreState } from "easy-peasy";
import { useStoreState } from "../hooks";
import Button from "./Shared/Button";
import classnames from "classnames";
import { AppMode } from "../enums";

const HowToUse = (): JSX.Element => {
  const [popUpVisible, setPopUpVisible] = useState(false);

  const appModeState = useStoreState((state) => state.appModel.appMode);

  const howToPopupContainerClass = classNames("how-to-backdrop", {
    "how-to-backdrop-active": popUpVisible,
    "how-to-backdrop-inactive": !popUpVisible,
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
      container.current.style.display = popUpVisible ? "initial" : "none";
    }
  }, [popUpVisible]);
  return (
    <div
      style={{ zIndex: 10 }}
      className={howToPopupContainerClass}
      // onClick={(e) => {
      //   if (popUpVisible) {
      //     // setPopUpVisible(false);
      //   }
      // }}
    >
      <div
        style={{ zIndex: 11, backgroundColor: "rgba(255, 0, 0, 0)" }}
        // style={{ zIndex: 11, backgroundColor: "rgba(255, 0, 0, 0)" }}
        onClick={(e) => {
          if (popUpVisible) {
            setPopUpVisible(false);
          }
        }}
        className={howToPopupContainerClass}
      ></div>
      <div className={buttonContainerClass}>
        {appModeState === AppMode.DISPLAY ? (
          <div>
            <HowToPopup active={popUpVisible} />
            <Button
              iconBefore={<InfoSignIcon></InfoSignIcon>}
              onClick={() => {
                setPopUpVisible(!popUpVisible);
              }}
              appearance="primary"
              text="Learn how to use this display"
            />
          </div>
        ) : (
          <></>
        )}
        {/* <HowToPopup active={popUpVisible} />
        <Button
          iconBefore={<InfoSignIcon></InfoSignIcon>}
          onClick={() => {
            // setPopUpVisible(true);
            setPopUpVisible(!popUpVisible);
            console.log(popUpVisible);
          }}
          appearance="primary"
          text="Learn how to use this display"
        /> */}
      </div>
    </div>
  );
};

export default HowToUse;

const HowToPopup = ({ active }: { active: boolean }): JSX.Element => {
  const howToPopupContainerClass = classNames("how-to-popup-container", {
    "how-to-popup-container-hidden": !active,
    "how-to-popup-container-display": active,
  });

  return ReactDom.createPortal(
    <div className={howToPopupContainerClass}>
      <h2>Connect Labtop</h2>
      <hr></hr>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt.
      </p>
      <img
        className={"how-to-image"}
        src={process.env.PUBLIC_URL + "/labtopdiagram.png"}
      />
      <h2>Explore Content</h2>
      <hr></hr>
      <p>
        Sed ut perspiciatis unde omnis iste natus error sit voluptatem
        accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab
        illo inventore veritatis et quasi architecto beatae vitae dicta sunt
        explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut
        odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
        voluptatem sequi nesciunt.
      </p>
      <img
        className={"how-to-image"}
        src={process.env.PUBLIC_URL + "/masonary.png"}
      />
    </div>,
    document.querySelector("#how-to-use-popup") as HTMLElement
  );
};
// export default HowToPopup;
