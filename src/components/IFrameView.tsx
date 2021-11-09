import "../css/iframeView.css";

import classNames from "classnames";
import React, { FC, PropsWithChildren, useState } from "react";
import Loader from "react-loader-spinner";
import ReactPlayer from "react-player";

import CardData from "../data_structs/CardData";

interface IFrameViewProperties {
  card: CardData;
  src: string;
  scale: number;
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
const IFrameView: FC<IFrameViewProperties> = ({ card, src, scale }) => {
  const [active, setActive] = useState(false);
  const [valid, setIsValid] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const isYouTubeVideo = new RegExp("youtube").test(src);

  const iframeOverlayClass = classNames("iframe-view-overlay", {
    "iframe-view-overlay-hidden": isLoaded,
    "iframe-view-overlay-loading": !isLoaded,
  });

  const indexFrameContainerClass = classNames("iframe-container", {
    "iframe-container-hidden": !valid,
  });
  //TODO: Fix or remove card error handling

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

  return (
    <div
      onDoubleClick={() => {
        setActive(!active);
      }}
      className={indexFrameContainerClass}
    >
      <div className={iframeOverlayClass}>
        <Loader type="Grid" color="white" height={80} width={80} />
      </div>
      {/* {renderContent(card, (e)=>{       setIsLoaded(true);} )} */}
      {card.contentType === "video" ? (
        <ResponsivePlayer
          src={card.src}
          onReady={(event) => {
            setIsLoaded(true);
          }}
        />
      ) : card.contentType === "image" ? (
        <img
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
          src={card.src}
          onLoad={(event) => {
            setIsLoaded(true);
          }}
        ></img>
      ) : (
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
function propertiesAreEqual(
  previousProperties: Readonly<PropsWithChildren<IFrameViewProperties>>,
  nextProperties: Readonly<PropsWithChildren<IFrameViewProperties>>
): boolean {
  if (previousProperties.src == nextProperties.src) {
    console.log(previousProperties.src);
    console.log(nextProperties.src);
    return false;
  }
  console.log(previousProperties.src);
  console.log(nextProperties.src);
  return true;
}

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
        url={src}
        width="100%"
        height="100%"
        onReady={onReady}
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
