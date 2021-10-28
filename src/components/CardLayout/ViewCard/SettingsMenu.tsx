import Button from '../../Shared/Button';
import React, { useRef } from 'react';
import SettingsButton from './SettingsButton';
import { ActionCreator, Actions } from 'easy-peasy';
import { CardModel } from './ViewCard';
import '../../../css/card/settingsMenu.css';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  TextInput,
} from "evergreen-ui";
import {useOnClickOutside} from "../../../hooks"

interface SettingsMenuProperties extends Pick<Actions<CardModel>, "setScale" | "setBackgroundColor" | "setShowMenu"> {
  isShown: boolean;
  scale: number;
}

const SettingsMenu = ({
  isShown,
  setScale,
  setBackgroundColor,
  setShowMenu,
  scale,
  
}: SettingsMenuProperties): JSX.Element => {
  const onOutside = () =>{console.log("got click outisde");}
  const menuRef = useRef(null)
  const handleClickOutside = useOnClickOutside(menuRef, ()=>{setShowMenu(false)})
  const menuStyle = {
    display: isShown ? "flex" : "none",
  } as React.CSSProperties;

  return (
    <div ref = {menuRef} className ={"menu-container"} style={menuStyle} {...handleClickOutside}>
        <InputRow title = {"Background Color:"
        }>
       <input
        className="nodrag"
        type="color"
        onChange={(e)=>{setBackgroundColor(e.target.value)}}
      />
        </InputRow>

        <InputRow title = {"Scale: "}>
        <ScaleControls setScale={setScale} scale={scale} />
        </InputRow>
    </div>
  );
};

const InputRow = ({title, children}:{title: string, children: JSX.Element | JSX.Element[]}): JSX.Element=>{
    return (
        <>
        <div className={"menu-input-row"}>
            {title}
            {children}
        </div>
        </>
    )
}

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
        height = {20}
        containerClass={"scale-controls-left"}
        // className={"scale-controls-left"}
        iconBefore={<ChevronLeftIcon size={30} />}
        onClick={() => {
          setScale(-0.1);
        }}
        // style={{ width: "fill-available" }}
      />
      {/* <TextInput
        // width = {20}
        // className={"scale-controls-input"}

        placeholder={scale.toString()}
      /> */}
      <input type="text" style ={{width: 30}}value = {scale.toString().slice(0, 3)}/>
      <Button
        width={20}
        height = {20}
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
