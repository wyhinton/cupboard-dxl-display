import type React from "react";

export interface CardSettings extends Pick<React.CSSProperties, "objectFit"> {
  id: string;
  scale?: number;
  backgroundColor?: string;
  objectPosition?: string;
  contentFit?: string;
}
