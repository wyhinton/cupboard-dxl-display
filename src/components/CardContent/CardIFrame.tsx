import React, { useEffect, useRef,useState } from "react";

import { CardView } from "../../enums";
import { useAppSettings } from "../../hooks";
import type { CardContentProperties } from "../CardContent";

type CardIFrameProperties = Pick<
  CardContentProperties,
  "onLoad" | "onError" | "cardSettings" | "card" | "cardView"
>;

const CardIFrame = ({
  onLoad,
  onError,
  card,
  cardSettings,
  cardView,
}: CardIFrameProperties): JSX.Element => {
  const { enableIframeInteractions } = useAppSettings();
  //   const { scale } = cardSettings;
  const scale = cardSettings?.scale ?? 1;
  const { src } = card;
  return (
    <iframe
      onError={(event) => {
        onError(event, card);
      }}
      onLoad={(event) => {
        onLoad(event, card);
      }}
      src={src}
      style={{
        transform: `scale(${scale})`,
        pointerEvents: enableIframeInteractions ? "all" : "none",
        width: `${100 * (1 / scale)}%`,
        height: `${100 * (1 / scale)}%`,
        transformOrigin: "top left",
      }}
    />
  );
};
export default CardIFrame;
