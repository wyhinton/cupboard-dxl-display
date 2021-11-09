import '../../../css/card/settingsMenu.css';

import { ActionCreator, Actions } from 'easy-peasy';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "evergreen-ui";
import React, { useRef } from 'react';

import {useOnClickOutside} from "../../../hooks"
import Button from '../../Shared/Button';
import SettingsButton from './SettingsButton';
import { CardModel } from './ViewCard';

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
  const menuReference = useRef(null)
  const handleClickOutside = useOnClickOutside(menuReference, ()=>{setShowMenu(false)})
  const menuStyle = {
    display: isShown ? "flex" : "none",
  } as React.CSSProperties;

  return (
    <div className ="menu-container" ref = {menuReference} style={menuStyle} {...handleClickOutside}>
        <InputRow title = "Background Color:">
       <input
        className="nodrag"
        defaultValue="rbga(0,0,0,0)"
        onChange={(e)=>{setBackgroundColor(e.target.value)}}
        type="color"
       />
        </InputRow>
        <InputRow title = "Scale: ">
        <ScaleControls scale={scale} setScale={setScale} />
        </InputRow>
    </div>
  );
};

const InputRow = ({title, children}:{title: string, children: JSX.Element | JSX.Element[]}): JSX.Element=>{
    return (
        <div className="menu-input-row">
            {title}
            {children}
        </div>
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
    <div className="scale-controls-grid">
      <Button
        containerClass="scale-controls-left"
        height = {20}
        iconBefore={<ChevronLeftIcon size={30} />}
        // className={"scale-controls-left"}
        onClick={() => {
          setScale(-0.1);
        }}
        width={20}
        // style={{ width: "fill-available" }}
      />

      <input onChange = {(e)=>{setScale(parseInt(e.target.value))}} style ={{width: 30}} defaultValue = {0.5} type="text" value = {scale.toString().slice(0, 3)}/>
      <Button
        containerClass="scale-controls-right"
        height = {20}
        iconBefore={<ChevronRightIcon size={30} />}
        // className={"scale-controls-right"}
        onClick={() => {
          setScale(0.1);
        }}
        // style={{ width: "-webkit-fill-available" }}
        width={20}
      />
    </div>
  );
};

export default SettingsMenu;
