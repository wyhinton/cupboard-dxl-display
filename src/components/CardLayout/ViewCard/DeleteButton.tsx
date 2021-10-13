import React from "react";
import "../../../css/viewCard.css";
import { DeleteIcon, ButtonAppearance } from "evergreen-ui";
import Button from "../../Shared/Button";

interface DeleteButtonProperties {
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }
  

const DeleteButton = ({ onClick }: DeleteButtonProperties): JSX.Element => {
    const deleteButtonStyle = {
      position: "absolute",
      top: "-1em",
      left: "-1em",
    } as React.CSSProperties;
  
    const subContStyle = {
      position: "absolute",
      left: -8,
    } as React.CSSProperties;
    
    return (
      <div
        style={deleteButtonStyle}
        className="delete-button-container"
        onMouseUp={onClick}
      >
        <div style={subContStyle}>
          <Button
            onClick={onClick}
            text={""}
            width={80}
            height={40}
            appearance={"danger" as ButtonAppearance}
            iconBefore={<DeleteIcon size={30} />}
          ></Button>
        </div>
      </div>
    );
  };
  

  export default DeleteButton