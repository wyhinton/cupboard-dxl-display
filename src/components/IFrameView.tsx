import "../css/iframeView.css";

import classNames from "classnames";
import React, {
  FC,
  PropsWithChildren,
  SyntheticEvent,
  useEffect,
  useState,
} from "react";
import Loader from "react-loader-spinner";
import ReactPlayer from "react-player";
// import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";

import CardData from "../data_structs/CardData";
import { CardView } from "../enums";

interface IFrameViewProperties {
  card: CardData;
  scale: number;
  cardView: CardView;
  onError: (
    e: SyntheticEvent<HTMLDivElement | HTMLIFrameElement | HTMLImageElement>
  ) => void;
  onLoad: (
    e: SyntheticEvent<HTMLDivElement | HTMLIFrameElement | HTMLImageElement>
  ) => void;
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
const IFrameView: FC<IFrameViewProperties> = ({
  card,
  scale,
  cardView,
  onError,
  onLoad,
}) => {
  const [active, setActive] = useState(false);
  const [valid, setIsValid] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const iframeOverlayClass = classNames("iframe-view-overlay", {
    "iframe-view-overlay-hidden": isLoaded,
    "iframe-view-overlay-loading": !isLoaded,
  });

  const indexFrameContainerClass = classNames("iframe-container", {
    "iframe-container-hidden": !valid,
  });

  useEffect(() => {
    console.log(cardView);
  }, [cardView]);
  const iframeStyle = {
    border: "none",
    transform: `scale(${scale})`,
    width: `${100 * (1 / scale)}%`,
    height: `${100 * (1 / scale)}%`,
    transformOrigin: "top left",
  } as React.CSSProperties;

  const iframeActive = {
    width: "100%",
    height: "100%",
    border: "5px blue",
  } as React.CSSProperties;

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
      {/* <div className={iframeOverlayClass}>
        <Loader color="white" height={80} type="Grid" width={80} />
      </div> */}
      {contentType === "video" ? (
        <ResponsivePlayer
          onReady={(event) => {
            setIsLoaded(true);
          }}
          src={card.src}
        />
      ) : contentType === "image" ? (
        <img
          onLoad={(event) => {
            // setIsLoaded(true);
            onLoad(event);
          }}
          onError={(e) => {
            onError(e);
          }}
          // src={"blablahblah"}
          src={src}
          style={{
            width: "100%",
            height: "100%",
            objectFit: cardView === CardView.PREVIEW ? "contain" : "cover",
            // objectFit: "cover",
            objectPosition:
              cardView === CardView.PREVIEW ? "contain" : "center",

            // maxHeight: "90vh",
          }}
        />
      ) : (
        //   </TransformComponent>
        // </TransformWrapper>
        <iframe
          onLoad={(event) => {
            setIsLoaded(true);
          }}
          src={src}
          style={active ? iframeActive : iframeStyle}
        ></iframe>
      )}
    </div>
  );
};

export default React.memo(IFrameView);

// function propertiesAreEqual(
//   previousProperties: Readonly<PropsWithChildren<IFrameViewProperties>>,
//   nextProperties: Readonly<PropsWithChildren<IFrameViewProperties>>
// ): boolean {
//   if (previousProperties.src == nextProperties.src) {
//     console.log(previousProperties.src);
//     console.log(nextProperties.src);
//     return false;
//   }
//   console.log(previousProperties.src);
//   console.log(nextProperties.src);
//   return true;
// }

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

class Content extends React.PureComponent<{ src: string }> {
  renderCount = 0;
  render() {
    this.renderCount++;
    return (
      <div
        style={{
          background: "#afa",
          padding: 8,
          borderRadius: 8,
          display: "inline-block",
        }}
      >
        {this.props.src}
        Hello from{" "}
        <span style={{ fontFamily: "monospace" }}>{"<Content />"}</span> ! I've
        rendered {this.renderCount} times.
      </div>
    );
  }
}
