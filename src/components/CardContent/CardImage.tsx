import React, { useEffect, useRef, useState } from "react";

import { CardView } from "../../enums";
import type { CardContentProperties } from "../CardContent";

type CardImageProperties = Pick<
  CardContentProperties,
  "onLoad" | "onError" | "cardSettings" | "card" | "cardView"
>;

const CardImage = ({
  onLoad,
  onError,
  card,
  cardSettings,
  cardView,
}: CardImageProperties): JSX.Element => {
  const { src } = card;
  return (
    <img
      onError={(event) => {
        onError(event, card);
      }}
      onLoad={(event) => {
        // setIsLoaded(true);
        onLoad(event, card);
      }}
      src={src}
      style={{
        transform: `scale(${cardSettings?.scale ?? 1})`,
        width: "100%",
        height: "100%",
        //@ts-ignore
        objectFit: cardSettings?.contentFit ?? "cover",
        objectPosition: cardView === CardView.PREVIEW ? "contain" : "center",
      }}
    />
  );
};
export default CardImage;
