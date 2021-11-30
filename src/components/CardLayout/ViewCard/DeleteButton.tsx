import "../../../css/deleteButton.css";

import { DeleteIcon } from "evergreen-ui";
import React from "react";

interface DeleteButtonProperties {
    action: ()=>void;
    onClick: React.MouseEventHandler<HTMLDivElement>;
  }
  

const DeleteButton = ({ onClick, action }: DeleteButtonProperties): JSX.Element => {
    return (
      <div
        className="delete-button-container"
        onMouseUp={onClick}
        onClick={onClick}
        onTouchEnd={(e)=>{action}}
      >
        <div
          // onClick={onClick}
        style={{display: "flex"}}
        >
          <DeleteIcon size={30} />
        </div>
      </div>
    );
  };
  

  export default DeleteButton