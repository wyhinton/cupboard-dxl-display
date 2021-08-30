import React, { useState, FC, PropsWithChildren } from "react";
// import { Spinner, Pane } from "evergreen-ui";
import classNames from "classnames";
import Loader from "react-loader-spinner";
import "../css/iframeView.css";
import IFrameValidator from "../IFrameValidator";
import { useStoreState, useStoreActions } from "../hooks";
import CardData from "../data_structs/CardData";
interface IFrameViewProperties {
  card: CardData;
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
const IFrameView: FC<IFrameViewProperties> = ({card, src }) => {
  const [active, setActive] = useState(false);
  const [valid, setIsValid] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const iframeOverlayClass = classNames("iframe-view-overlay", {
    "iframe-view-overlay-hidden": isLoaded,
    "iframe-view-overlay-loading": !isLoaded,
  });
  const iFrameContainerClass = classNames("iframe-container", {
    "iframe-container-hidden": !valid,
  });
  const registerCardLoadFailure = useStoreActions((actions) => actions.appModel.registerCardLoadFailure);
  
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
      className={iFrameContainerClass}
      style={{ height: "100%" }}
    >
      <div className={iframeOverlayClass}>
        <Loader type="Grid" color="white" height={80} width={80} />
      </div>
      <iframe
        onLoad={(event) => {
          const yt= "https://www.youtube.com/";
          // card.validator.url = yt;
          card.validator.validate(event);
          console.log(card.validator.isValid());
          //if the card is not valid and the card has not already been marked as failed, send a message to fail the card 
          if (!card.validator.isValid() && !card.failed){
            registerCardLoadFailure(card)
          } 
          setIsLoaded(true);
        }}
        // src={"https://www.youtube.com/"}
        src={src}
        style={active ? iframeActive : iframeStyle}
      ></iframe>
    </div>
  );
};



export default React.memo(IFrameView, propertiesAreEqual);
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
