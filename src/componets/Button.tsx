import React, { useState } from "react";
import { Button as EverGreenButton } from "evergreen-ui";

/**
 * Button Element which wraps and Evergreen UI Button
 */
const Button = ({
  onClick,
  text,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  text: string;
}): JSX.Element => {
  return (
    <div onClick={onClick}>
      <EverGreenButton>{text}</EverGreenButton>
    </div>
  );
};

export default Button;
