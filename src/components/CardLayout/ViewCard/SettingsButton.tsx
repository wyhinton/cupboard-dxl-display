import "../../../css/card/settingsButton.css";

import { CogIcon, Popover } from "evergreen-ui";
import React, { useRef } from "react";

import SettingsMenu from "../../EditorPanel/SettingsMenu";

const SettingsButton = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}): JSX.Element => {
  return (
    <div
      // className="settings-button-container"
      onMouseUp={onClick}
      style={{
        position: "absolute",
        /* top: -2em; */
        bottom: "40%",
        left: 0,
        width: 40,
        height: 40,
        // width: "20px !important",
        // height: "20px !important",
        borderRadius: "50%",
        overflow: "hidden",
        boxShadow: "var(--shadow)",
        zIndex: 100,
        background: "white",
        justifyContent: "center",
        alignItems: "center",
        display: "flex",
        transform: "translate(-50%, 0px)",
      }}
    >
      <div
        //   onClick={onClick}
        style={{ display: "flex" }}
      >
        <CogIcon size={30} />
      </div>
    </div>
  );
};

export default SettingsButton;
