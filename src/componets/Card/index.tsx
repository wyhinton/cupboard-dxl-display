import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  ReactElement,
} from "react";
import CardInfo from "./CardInfo";
import CardData from "../../data_structs/cardData";
import { Layout } from "react-grid-layout";
import { AppMode } from "../../enums";
import { useStoreState, useStoreActions } from "../../hooks";
import { useLongPress } from "react-use";
import { CardView } from "../../enums";
import classNames from "classnames";
import "../../css/card.css";
import TestModal from "../TestModal";
import type { HtmlPortalNode } from "react-reverse-portal";
import { Component } from "evergreen-ui/node_modules/@types/react";
import { Transition } from "react-transition-group";

import {
  createHtmlPortalNode,
  createSvgPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";

interface ViewCardProps {
  children: React.ReactElement[] | React.ReactElement;
  key?: string;
  activeKey?: React.MutableRefObject<string>;
  testkey?: string;
  dataGrid?: Layout;
  data?: CardData;
  setModal?: () => void;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
}
/**
 * Wraps card content. Handles the reactive styling of componets.
 * @component
 */

const ViewCard = ({
  children,
  key,
  activeKey,
  testkey,
  dataGrid,
  data,
  setModal,
  onDoubleClick,
}: ViewCardProps): JSX.Element => {
  const elementRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    // const divElement = elementRef.current;
    console.log("ele erf us effect");
    const boundingRect =
      elementRef.current?.parentElement?.getBoundingClientRect();
    setTargetBoundingBox(boundingRect);
    // console.log("ele ref changed");
  }, [elementRef.current?.parentElement?.style]);

  const viewMode = useStoreState((state) => state.appData.appMode);
  const [cardView, setCardView] = useState(CardView.NORMAL);
  const [targetBoundingBox, setTargetBoundingBox] =
    useState<undefined | DOMRect>();
  const cardClass = classNames("card", {
    "card-edit": viewMode === AppMode.EDIT,
    "card-display": viewMode === AppMode.DISPLAY,
    "card-preview": cardView === CardView.PREVIEW,
  });
  const cardInfoClass = classNames("info", {
    "info-display": viewMode === AppMode.DISPLAY,
    "info-preview": cardView === CardView.PREVIEW,
  });

  const portalNode = React.useMemo(() => createHtmlPortalNode(), []);
  const onLongPress = () => {
    const boundingRect =
      elementRef.current?.parentElement?.getBoundingClientRect();
    setTargetBoundingBox(boundingRect);
    // console.log(boundingRect);
    // const transform = elementRef.current?.parentElement?.style.transform;

    switch (cardView) {
      case CardView.NORMAL:
        setCardView(CardView.PREVIEW);
        console.log("it was normal");
        break;
      case CardView.PREVIEW:
        console.log("it was preview");
        setCardView(CardView.NORMAL);
        // setCardView(CardView.FULL_SCREEN);
        break;
      case CardView.FULL_SCREEN:
        console.log("it was full screen");
        break;
      default:
        console.log("got defalt");
        break;
    }
  };

  const defaultOptions = {
    isPreventDefault: true,
    delay: 100,
  };
  // const longPressEvent = useLongPress(onLongPress, defaultOptions);
  const determineOut = (
    chil: ReactElement | ReactElement[],
    view: CardView,
    node: HtmlPortalNode<Component<any>>,
    rect: DOMRect | undefined,
    isActive: boolean
  ): ReactElement => {
    //if in preview mode or full screen mode render card to the portal
    if (
      (view === CardView.PREVIEW || view === CardView.FULL_SCREEN) &&
      isActive
    ) {
      console.log("passed");
      if (Array.isArray(chil)) {
        const chilarr = chil as ReactElement[];
        const hasval = chilarr.some(({ type }) => type == TestModal);
        // console.log(hasval);
      } else {
        const charsingle = chil as ReactElement;
        const istype = charsingle.type == TestModal;
        // console.log(istype);
      }

      return (
        <TestModal
          text={"hello"}
          portal={node}
          boundingRect={targetBoundingBox}
          mode={view}
          // onClick={}
        ></TestModal>
      );
      //else render card to it's normal display position
    } else {
      console.log("did not pass");
      return <OutPortal node={node}></OutPortal>;
    }
  };
  return (
    <div
      className={cardClass}
      style={{ height: "100%" }}
      // style={backgroundStyle}
      onDoubleClick={() => {
        onDoubleClick;
        // if 
        setCardView(CardView.FULL_SCREEN);
        // console.log("setting full screen");
      }}
      onMouseUp={() => {
        onLongPress();
        // console.log("got simple mouse up");
        if (setModal) {
          setModal();
        }
      }}
      onMouseDown={() => {
        console.log(key);
        console.log(testkey);
      }}
      //reference to the clicked card into order to get the cards transforms and copy it to the modal
      ref={elementRef}
    >
      <InPortal node={portalNode}>
        {/* <div
          style={{ height: "100%" }}
          data-grid={dataGrid ?? undefined}
          className={cardClass}
        > */}
        <div className={"card-child-container"} style={{ height: "100%" }}>
          {children}
        </div>
        {/* {children} */}
        {data ? <CardInfo data={data} className={cardInfoClass} /> : ""}
      </InPortal>
      {determineOut(
        children,
        cardView,
        portalNode,
        targetBoundingBox,
        activeKey?.current == testkey
      )}
    </div>
  );
};

export default ViewCard;
// export default React.memo(ViewCard, propsAreEqual);
// function propsAreEqual(
//   prev: Readonly<PropsWithChildren<ViewCardProps>>,
//   next: Readonly<PropsWithChildren<ViewCardProps>>
// ) {
//   //returning false will update component, note here that nextKey.number never changes.
//   //It is only constantly passed by props
//   console.log(prev);
//   console.log(next);
//   //  return !next.toChild.includes(next.number)
// }
const ComponentA = ({ portal }: { portal: HtmlPortalNode<Component<any>> }) => {
  return <OutPortal node={portal} />;
};
// const MyComponent = ({ componentToShow }: { componentToShow: string }) => {
//   // Create a portal node: this holds your rendered content
//   const portalNode = React.useMemo(() => createHtmlPortalNode(), []);

//   return (
//     <div>
//       {/*
//             Render the content that you want to move around later.
//             InPortals render as normal, but send the output to detached DOM.
//             MyExpensiveComponent will be rendered immediately, but until
//             portalNode is used in an OutPortal, MyExpensiveComponent, it
//             will not appear anywhere on the page.
//         */}
//       <InPortal node={portalNode}>
//         <ViewCard
//           data={{
//             src: "https://observablehq.com/embed/@d3/zoomable-circle-packing?cells=chart",
//             title: "test",
//           }}
//           key={"test key"}
//         >
//           <IFrameView
//             src={
//               "https://observablehq.com/embed/@d3/zoomable-circle-packing?cells=chart"
//             }
//           />
//         </ViewCard>
//       </InPortal>

//       {/* ... The rest of your UI ... */}

//       {/* Later, pass the portal node around to whoever might want to use it: */}
//       {componentToShow === "component-a" ? (
//         <ComponentA portal={portalNode} />
//       ) : (
//         <ComponentB portal={portalNode} />
//       )}
//     </div>
//   );
// };

// import React, { useState, useEffect } from "react";
// import CardInfo from "./CardInfo";
// import CardData from "../../data_structs/cardData";
// import { Layout } from "react-grid-layout";
// import { ViewMode } from "../../enums";
// import { useStoreState, useStoreActions } from "../../hooks";
// import { useLongPress } from "react-use";
// import { CardView } from "../../enums";
// import classNames from "classnames";
// import "../../css/card.css";
// import TestModal from "../TestModal";
// import type { HtmlPortalNode } from "react-reverse-portal";
// import {
//   createHtmlPortalNode,
//   createSvgPortalNode,
//   InPortal,
//   OutPortal,
// } from "react-reverse-portal";

// interface ViewCardProps {
//   key?: string;
//   children: JSX.Element | JSX.Element[];
//   dataGrid?: Layout;
//   data?: CardData;
//   onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
// }
// /**
//  * Wraps card content. Handles the reactive styling of componets.
//  * @component
//  */

// const ViewCard = ({
//   children,
//   dataGrid,
//   data,
//   onDoubleClick,
// }: ViewCardProps): JSX.Element => {
//   const viewMode = useStoreState((state) => state.appData.viewMode);
//   const [cardView, setCardView] = useState(CardView.NORMAL);

//   const cardClass = classNames("card", {
//     "card-edit": viewMode === ViewMode.EDIT,
//     "card-display": viewMode === ViewMode.DISPLAY,
//     "card-preview": cardView === CardView.PREVIEW,
//   });

//   const onLongPress = () => {
//     console.log(cardClass);

//     console.log("calls callback after long pressing 300ms");
//     switch (cardView) {
//       case CardView.NORMAL:
//         setCardView(CardView.PREVIEW);
//         console.log("it was normal");
//         break;
//       case CardView.PREVIEW:
//         console.log("it was preview");
//         break;
//       case CardView.FULL_SCREEN:
//         console.log("it was full screen");
//         break;
//       default:
//         console.log("got defalt");
//         break;
//     }
//   };

//   const defaultOptions = {
//     isPreventDefault: true,
//     delay: 100,
//   };
//   const longPressEvent = useLongPress(onLongPress, defaultOptions);
// //   const portalNode = React.useMemo(() => createHtmlPortalNode(), []);
//   return (
//     <div
//       // className={"view-card"}
//       className={cardClass}
//       // style={backgroundStyle}
//       onDoubleClick={() => {
//         onDoubleClick;
//       }}
//       {...longPressEvent}
//     >
//       <div style={{ height: "100%" }} data-grid={dataGrid ?? undefined}>
//         <div style={{ height: data ? "100%" : "100%" }}>{children}</div>
//         <div
//           style={{
//             position: "absolute",
//             color: "red",
//             fontSize: "20pt ",
//             zIndex: 1,
//             top: 0,
//             left: 0,
//           }}
//         >
//           {}
//         </div>
//       </div>
//       {data ? <CardInfo data={data} /> : ""}
//     </div>
//   );
// };

// export default ViewCard;
