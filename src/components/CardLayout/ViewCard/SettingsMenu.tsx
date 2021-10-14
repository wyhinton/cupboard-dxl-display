import React from "react";
import "../../../css/deleteButton.css";
import { Popover} from "evergreen-ui";
import SettingsButton from './SettingsButton';


const SettingsMenu = ({isShown}:{isShown?: boolean}): JSX.Element => {
    return (
            <MenuContent/>
    );
  }
  

const MenuContent = () =>{
    return(
        <div>
        settings
        </div>
    )
}

  export default SettingsMenu