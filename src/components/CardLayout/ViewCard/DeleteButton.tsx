import React from "react";
import "../../../css/deleteButton.css";
import { DeleteIcon, ButtonAppearance } from "evergreen-ui";

interface DeleteButtonProperties {
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }
  

const DeleteButton = ({ onClick }: DeleteButtonProperties): JSX.Element => {
    return (
      <div
        className="delete-button-container"
        onMouseUp={onClick}
      >
        <div
          onClick={onClick}
        style={{display: "flex"}}>
          <DeleteIcon size={30} />
        </div>
      </div>
    );
  };
  

  export default DeleteButton