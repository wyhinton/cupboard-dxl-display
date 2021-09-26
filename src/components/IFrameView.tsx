import React, { useState, FC, PropsWithChildren, PureComponent } from "react";
// import { Spinner, Pane } from "evergreen-ui";
import classNames from "classnames";
import Loader from "react-loader-spinner";
import "../css/iframeView.css";
import IFrameValidator from "../IFrameValidator";
import { useStoreState, useStoreActions } from "../hooks";
import CardData from "../data_structs/CardData";
import ReactPlayer from "react-player"

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
const IFrameView: FC<IFrameViewProperties> = ({card, src,  }) => {
  const [active, setActive] = useState(false);
  const [valid, setIsValid] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const isYouTubeVideo =  new RegExp('youtube').test(src)


  const iframeOverlayClass = classNames("iframe-view-overlay", {
    "iframe-view-overlay-hidden": isLoaded,
    "iframe-view-overlay-loading": !isLoaded,
  });

  const iFrameContainerClass = classNames("iframe-container", {
    "iframe-container-hidden": !valid,
  });
  //TODO: Fix or remove card error handling
  // const registerCardLoadFailure = useStoreActions((actions) => actions.appModel.registerCardLoadFailure);
  
  const iframeStyle = {
    width: "100%",
    height: "100%",
    border: "none",
  } as React.CSSProperties;

  const iframeActive = {
    width: "100%",
    height: "100%",
    border: "5px blue",
  } as React.CSSProperties;

  return (
    <div
      onDoubleClick={() => {
        setActive(!active);
      }}
      className={iFrameContainerClass}
    >
      <div className={iframeOverlayClass}>
        <Loader type="Grid" color="white" height={80} width={80} />
      </div>
      {
        isYouTubeVideo?
        <ResponsivePlayer src = {src} onReady = {(event)=>{setIsLoaded(true)}}/>
        :<iframe
        onLoad={(event) => {
          setIsLoaded(true);
        }}
        src={src}
        style={active ? iframeActive : iframeStyle}
      ></iframe>
      }
    </div>
  );
};

// function determineoOutput(src: string, onLoad: (e)): JSX.Element{
//   const out = (new RegExp('youtube')).test(src)
//   console.log(out);
  
//   return (
//     out?<ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' />:<div>b</div>
//   )
// }


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


const ResponsivePlayer = ({src, onReady}:{src: string, onReady: (e: ReactPlayer)=>void}): JSX.Element=>{
  return (
    <div className='player-wrapper'>
      <ReactPlayer
        className='react-player'
        url={src}
        width='100%'
        height='100%'
        onReady={onReady}
      />
    </div>
  )
}


class Content extends React.PureComponent<{src: string}>{
  renderCount = 0;
  render() {
    this.renderCount++;
    return (
      <div
        style={{
          background: "#afa",
          padding: 8,
          borderRadius: 8,
          display: "inline-block"
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