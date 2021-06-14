import React, { useState } from "react";

/**
 * Minimal warpper for an <iframe>. Can be toggled between a full screen, active view, and a regular card view.
 * @component
 * @example
 * const my_url = "https://www.youtube.com/embed/tgbNymZ7vqY";
 * return(
 *  <IFrameView src = {my_url}/>
 * )
 */
const IFrameView = ({ src }: { src: string }): JSX.Element => {
  const [active, setActive] = useState(false);
  // const
  const iframeStyle = {
    width: "100%",
    pointerEvents: "none",
    // height: "500px",
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
      style={{ height: "100%" }}
    >
      <iframe
        src={
          src
          // "https://www.youtube.com/embed/tgbNymZ7vqY"
          // "https://www.openstreetmap.org/export/embed.html?bbox=-0.004017949104309083%2C51.47612752641776%2C0.00030577182769775396%2C51.478569861898606&layer=mapnik"
        }
        style={active ? iframeActive : iframeStyle}
      ></iframe>
    </div>
  );
};

export default React.memo(IFrameView);
