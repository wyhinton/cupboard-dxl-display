import React, { useState, useEffect } from "react";
import ReactDom from "react-dom";
import { Button as EverGreenButton } from "evergreen-ui";
import { Component } from "evergreen-ui/node_modules/@types/react";
import { createHtmlPortalNode, OutPortal } from "react-reverse-portal";
import type { HtmlPortalNode } from "react-reverse-portal";
import { setTimeout } from "timers";
import "../css/modal.css";
import { CardView } from "../enums";
import classNames from "classnames";

/**
 * Wraps an Evergreen UI Button.
 * @component
 */

interface ModalProps {
  // ref: HTMLDivElement;
  text: string;
  mode?: CardView;
  boundingRect?: DOMRect;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  portal?: HtmlPortalNode<Component<any>>;
}

// export function TestC React.forwardRef<HTMLDivElement>((props, ref) => {
//   return <input ref={ref} type="search" />;
// });

// TestC.dispalyName = "MyC";

const TestModal = ({
  // const TestModal = ({
  text,
  mode,
  boundingRect,
  onClick,
  portal,
}: ModalProps): JSX.Element => {
  //   } as React.CSSProperties;
  const [containerStyle, setContainerStyle] = useState({
    position: "absolute",
    width: 500,
    height: 500,
    backgroundColor: "black",
    left: 0,
    bottom: 0,
    top: 0,
    animation: "width .5s linear",
    // transform: transform,
  });
  const [viewMode, setViewMode] = useState(CardView.NORMAL);
  useEffect(() => {
    console.log("got mode change");
    if (mode) {
      setViewMode(mode);
    }
  }, [mode]);

  const cardClass = classNames("modal", {
    // "modal-full-screen": viewMode === CardView.FULL_SCREEN,
    "modal-preview": viewMode === CardView.PREVIEW,
  });

  useEffect(() => {
    // console.log("got dom rect effect");
    // console.log(boundingRect);
    const changed = { ...containerStyle };
    if (boundingRect?.width) {
      changed.width = boundingRect.width;
    }
    if (boundingRect?.height) {
      changed.height = boundingRect.height;
    }

    if (boundingRect?.x) {
      changed.left = boundingRect.x;
    }
    if (boundingRect?.y) {
      changed.top = boundingRect?.y;
    }

    setContainerStyle(changed);

    setTimeout(() => {
      const new_changed = { ...changed };
      if (boundingRect?.width) {
        new_changed.width = boundingRect.width + 200;
      }
      if (boundingRect?.height) {
        new_changed.height = boundingRect.height + 200;
      }
      setContainerStyle(new_changed);
    }, 400);
  }, [boundingRect]);

  return ReactDom.createPortal(
    <>
      <MyBackdrop show={true}>
        <div
          className={"modal-content-container"}
          onMouseUp={onClick}
          style={containerStyle as React.CSSProperties}
          // className={cardClass}
        >
          {portal ? (
            <OutPortal node={portal}></OutPortal>
          ) : (
            <div className={"modal-no-content"}>no portal</div>
          )}
        </div>
      </MyBackdrop>
    </>,
    document.getElementById("portal") as HTMLElement
  );
};
//   return ReactDom.createPortal(
//     <>
//       <div
//         ref={ref}
//         onMouseUp={onClick}
//         style={containerStyle as React.CSSProperties}
//       >
//         <EverGreenButton>{text}</EverGreenButton>
//         {portal ? <OutPortal node={portal}></OutPortal> : <div>no portal</div>}
//       </div>
//     </>,
//     document.getElementById("portal") as HTMLElement
//   );
// };

export default TestModal;

interface BackdropProps {
  show: boolean;
  children: JSX.Element | JSX.Element[];
}
const MyBackdrop = ({ show, children }: BackdropProps) => {
  return <div className={"modal-backdrop-active "}>{children}</div>;
};
// const ComponentA = ({ portal }: { portal: HtmlPortalNode<Component<any>> }) => {
//   return (
//     <div>
//       {/* ... Some more UI ... */}

//       {/* Show the content of the portal node here: */}
//       <OutPortal node={portal} />
//     </div>
//   );
// };
