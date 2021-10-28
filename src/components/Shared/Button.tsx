import React, { useState } from "react";
import { Button as EverGreenButton, ButtonAppearance } from "evergreen-ui";

/**
 * Wraps an Evergreen UI Button, providing it with an onClick property.
 * @component
 */

interface ButtonProperties {
  onClick: React.MouseEventHandler<HTMLDivElement>;
  text?: string;
  appearance?: ButtonAppearance;
  className?: string;
  iconBefore?: JSX.Element;
  width?: number | string;
  height?: number | string;
  containerClass?: string;
  style?: React.CSSProperties;
}
const Button = ({
  onClick,
  text,
  appearance,
  className,
  iconBefore,
  width,
  height,
  style,
  containerClass,
}: ButtonProperties): JSX.Element => {
  return (
    <div onMouseUp={onClick} className={containerClass}>
      <EverGreenButton
        cursor="pointer"
        //use evergreen's default button with if no width is provided
        width={width ?? undefined}
        height={height ?? undefined}
        iconBefore={iconBefore ?? undefined}
        className={className}
        appearance={appearance ?? "default"}
        style={style}
      >
        {text}
      </EverGreenButton>
    </div>
  );
};

export default Button;
