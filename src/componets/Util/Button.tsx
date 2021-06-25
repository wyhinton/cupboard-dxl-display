import React, { useState } from "react";
import { Button as EverGreenButton } from "evergreen-ui";

/**
 * Wraps an Evergreen UI Button.
 * @component
 */
const Button = ({
  onClick,
  text,
}: {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  text: string;
}): JSX.Element => {
  return (
    <div onMouseUp={onClick}>
      <EverGreenButton>{text}</EverGreenButton>
    </div>
  );
};

export default Button;
