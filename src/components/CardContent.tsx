import "../css/iframeView.css";

import classNames from "classnames";
import type { FC} from "react";
import React, { useEffect, useState } from "react";
import ReactPlayer from "react-player";

import type CardData from "../data_structs/CardData";
import type { CardView } from "../enums";
import { useAppSettings } from "../hooks";
import type { CardSettings } from "../interfaces/CardSettings";
import CardIFrame from "./CardContent/CardIFrame";
import CardImage from "./CardContent/CardImage";
import type {
  CardErrorHandler,
  CardLoadHandler,
} from "./CardLayout/ViewCard/ViewCard";

export interface CardContentProperties {
  card: CardData;
  scale: number;
  cardView: CardView;
  onError: CardErrorHandler;
  onLoad: CardLoadHandler;
  cardSettings?: CardSettings;
  objectFit?: string;
}
/**
 * Minimal warpper for an <iframe>. Can be toggled between a full screen, active view, and a regular card view.
 * @component
 * @example
 * const my_url = "https://www.youtube.com/embed/tgbNymZ7vqY";
 * return(
 *  <IFrameView src = {my_url}/>
 * )
 */
const IFrameView: FC<CardContentProperties> = ({
  card,
  scale,
  cardView,
  onError,
  onLoad,
  objectFit,
  cardSettings,
}) => {
  const [active, setActive] = useState(false);
  const [valid, setIsValid] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const indexFrameContainerClass = classNames("iframe-container", {
    "iframe-container-hidden": !valid,
  });

  useEffect(() => {}, [cardView]);

  const qrContainerStyle = {
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 10,
  } as React.CSSProperties;

  const { src, contentType } = card;

  return (
    <div
      className={indexFrameContainerClass}
      onDoubleClick={() => {
        setActive(!active);
      }}
    >
      {contentType === "video" ? (
        <ResponsivePlayer
          onReady={(event) => {
            setIsLoaded(true);
          }}
          src={card.src}
        />
      ) : contentType === "image" ? (
        <CardImage
          card={card}
          cardSettings={cardSettings}
          cardView={cardView}
          onError={onError}
          onLoad={onLoad}
        />
      ) : (
        <CardIFrame
          card={card}
          cardSettings={cardSettings}
          cardView={cardView}
          onError={onError}
          onLoad={onLoad}
        />
      )}
    </div>
  );
};

export default React.memo(IFrameView);

const ResponsivePlayer = ({
  src,
  onReady,
}: {
  src: string;
  onReady: (e: ReactPlayer) => void;
}): JSX.Element => {
  return (
    <div className="player-wrapper">
      <ReactPlayer
        className="react-player"
        controls
        height="100%"
        muted
        onReady={onReady}
        playing
        url={src}
        width="100%"
      />
    </div>
  );
};
