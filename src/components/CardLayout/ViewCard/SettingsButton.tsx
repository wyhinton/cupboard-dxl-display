import React, { useRef } from "react";
import "../../../css/card/settingsButton.css";
import { CogIcon, Popover } from "evergreen-ui";
import SettingsMenu from "./SettingsMenu";

const SettingsButton = ({
  onClick,
}: {
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}): JSX.Element => {
  const target = useRef();
  return (
    <div className="settings-button-container" onMouseUp={onClick}>
      <div
        //   onClick={onClick}
        style={{ display: "flex" }}
      >
        <CogIcon size={15} />
      </div>
    </div>
  );
};

export default SettingsButton;
