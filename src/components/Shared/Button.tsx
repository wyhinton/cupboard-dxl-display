import React, { useState } from "react";
import { Button as EverGreenButton, ButtonAppearance } from "evergreen-ui";

/**
 * Wraps an Evergreen UI Button, providing it with an onClick property.
 * @component
 */

interface ButtonProperties {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  text: string;
  appearance?: ButtonAppearance;
  className?: string;
  iconBefore?: JSX.Element;
  width?: number;
}
const Button = ({
  onClick,
  text,
  appearance,
  className,
  iconBefore,
  width,
}: ButtonProperties): JSX.Element => {
  return (
    <div onMouseUp={onClick}>
      <EverGreenButton
        //use evergreen's default button with if no width is provided
        width={width ?? null}
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
