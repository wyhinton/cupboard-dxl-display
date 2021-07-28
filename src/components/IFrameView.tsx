import React, { useState, FC, PropsWithChildren } from "react";
import { Spinner, Pane } from "evergreen-ui";
import classNames from "classnames";
import Loader from "react-loader-spinner";
import "../css/iframeView.css";
interface IFrameViewProps {
  src: string;
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
const IFrameView: FC<IFrameViewProps> = ({ src }) => {
  const [active, setActive] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeOverlayClass = classNames("iframe-view-overlay", {
    "iframe-view-overlay-hidden": isLoaded,
    "iframe-view-overlay-loading": !isLoaded,
  });
  const iframeStyle = {
    width: "100%",
    pointerEvents: "none",
    height: "100%",
    border: "none",
  } as React.CSSProperties;
  const iframeActive = {
    width: "100%",
    pointerEvents: "none",
    height: "100%",
    border: "5px blue",
  } as React.CSSProperties;

  return (
    <div
      onDoubleClick={() => {
        setActive(!active);
      }}
      className={"iframe-view-container"}
      style={{ height: "100%" }}
    >
      <div className={iframeOverlayClass}>
        <Loader type="Grid" color="white" height={80} width={80} />
      </div>
      <iframe
        onLoad={(e) => {
          setIsLoaded(true);
        }}
        src={src}
        style={active ? iframeActive : iframeStyle}
      ></iframe>
    </div>
  );
};

export default React.memo(IFrameView, propsAreEqual);
function propsAreEqual(
  prevProps: Readonly<PropsWithChildren<IFrameViewProps>>,
  nextProps: Readonly<PropsWithChildren<IFrameViewProps>>
): boolean {
  if (prevProps.src == nextProps.src) {
    console.log(prevProps.src);
    console.log(nextProps.src);
    return false;
  }
  console.log(prevProps.src);
  console.log(nextProps.src);
  return true;
}
