import Button from '../../Shared/Button';
import React from 'react';
import SettingsButton from './SettingsButton';
import { ActionCreator, Actions } from 'easy-peasy';
import { CardModel } from './ViewCard';
import '../../../css/card/settingsMenu.css';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TextInput,
} from "evergreen-ui";
import {ChromePicker} from "react-color";

interface SettingsMenuProperties extends Pick<Actions<CardModel>, "setScale" | "setBackgroundColor"> {
  isShown: boolean;
  scale: number;
}

const SettingsMenu = ({
  isShown,
  setScale,
  setBackgroundColor,
  scale,
}: SettingsMenuProperties): JSX.Element => {

  const menuStyle = {
    width: "230px",
    height: "300px",
    position: "absolute",
    left: "-250px",
    backgroundColor: "red",
    display: isShown ? "flex" : "none",
    top: "50%",
    zIndex: 100,
  } as React.CSSProperties;

  return (
    <div style={menuStyle}>
        <ChromePicker onChangeComplete={(col, event)=>{setBackgroundColor(col.hex)}}/>
      <ScaleControls setScale={setScale} scale={scale} />
    </div>
  );
};

const ScaleControls = ({
  setScale,
  scale,
}: {
  setScale: ActionCreator<number>;
  scale: number;
}): JSX.Element => {
  return (
    <div className={"scale-controls-grid"}>
      <Button
        width={20}
        containerClass={"scale-controls-left"}
        // className={"scale-controls-left"}
        iconBefore={<ChevronLeftIcon size={30} />}
        onClick={() => {
          setScale(-0.1);
        }}
        // style={{ width: "fill-available" }}
      />
      <TextInput
        className={"scale-controls-input"}
        placeholder={scale.toString()}
      />
      <Button
        width={20}
        containerClass={"scale-controls-right"}
        // className={"scale-controls-right"}
        iconBefore={<ChevronRightIcon size={30} />}
        // style={{ width: "-webkit-fill-available" }}
        onClick={() => {
          setScale(0.1);
        }}
      />
    </div>
  );
};

export default SettingsMenu;
