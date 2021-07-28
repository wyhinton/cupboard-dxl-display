import React, { useState } from "react";
import { Button as EverGreenButton, ButtonAppearance } from "evergreen-ui";

/**
 * Wraps an Evergreen UI Button, providing it with an onClick property.
 * @component
 */

interface ButtonProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  text: string;
  appearance?: ButtonAppearance;
  className?: string;
  iconBefore?: JSX.Element;
}
const Button = ({
  onClick,
  text,
  appearance,
  className,
  iconBefore,
}: ButtonProps): JSX.Element => {
  return (
    <div onMouseUp={onClick}>
      <EverGreenButton
        iconBefore={iconBefore ?? null}
        className={className}
        appearance={appearance ?? "default"}
      >
        {text}
      </EverGreenButton>
    </div>
  );
};

export default Button;
