import React, {
  PropsWithChildren,
  useState,
  useEffect,
  useRef,
  FC,
  ReactElement,
} from "react";
import CardInfo from "./CardInfo";
import CardData from "../../data_structs/CardData";
import { Layout } from "react-grid-layout";
import { AppMode } from "../../enums";
import { useStoreState, useStoreActions } from "../../hooks";
import { useLongPress } from "react-use";
import { CardView } from "../../enums";
import classNames from "classnames";
import "../../css/card.css";
import Modal from "../Modal";
import type { HtmlPortalNode } from "react-reverse-portal";
import { Component } from "evergreen-ui/node_modules/@types/react";
import {
  createHtmlPortalNode,
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

const ViewCard: FC<ViewCardProps> = ({
  children,
  activeKey,
  testkey,
  data,
  setModal,
  onDoubleClick,
}: ViewCardProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const appModeState = useStoreState((state) => state.appModel.appMode);
  const [cardView, setCardView] = useState(CardView.NORMAL);

  const cardClass = classNames("card", {
    "card-edit": appModeState === AppMode.EDIT,
    "card-display": appModeState === AppMode.DISPLAY,
    "card-preview": cardView === CardView.PREVIEW,
  });

  const cardInfoClass = classNames("info", {
    "info-hidden": appModeState === AppMode.EDIT,
    "info-display": appModeState === AppMode.DISPLAY,
    "info-preview": cardView === CardView.PREVIEW,
  });

  const portalNode = React.useMemo(
    // () => createHtmlPortalNode(),
    () =>
      createHtmlPortalNode({
        attributes: { id: "div-1", style: "height: 100%" },
      }),
    []
  );

  const onLongPress = (): void => {
    //only resize the card on press if app is in display mode
    if (appModeState === AppMode.DISPLAY) {
      switch (cardView) {
        case CardView.NORMAL:
          setCardView(CardView.PREVIEW);
          console.log("it was normal");
          break;
        case CardView.PREVIEW:
          console.log("it was preview");
          setCardView(CardView.NORMAL);
          break;
        case CardView.FULL_SCREEN:
          console.log("it was full screen");
          break;
        default:
          console.log("got defalt");
          break;
      }
    }
  };

  const determineOut = (
    chil: ReactElement | ReactElement[],
    view: CardView,
    node: HtmlPortalNode<Component<any>>,
    // rect: DOMRect | undefined,
    isActive: boolean
  ): ReactElement => {
    //if in preview mode or full screen mode render card to the portal
    if (
      (view === CardView.PREVIEW || view === CardView.FULL_SCREEN) &&
      isActive
    ) {
      console.log("passed");
      return (
        <Modal
          text={"hello"}
          portal={node}
          // boundingRect={targetBoundingBox}
          mode={view}
        ></Modal>
      );
    } else {
      console.log("did not pass");
      return <OutPortal node={node}></OutPortal>;
    }
  };

  return (
    //receives a drag objects
    <div
      className={cardClass}
      style={{ height: "100%" }}
      onDoubleClick={() => {
        onDoubleClick;
        if (appModeState == AppMode.DISPLAY) {
          setCardView(CardView.FULL_SCREEN);
        }
      }}
      onMouseUp={() => {
        onLongPress();
        // console.log("got simple mouse up");
        if (setModal) {
          setModal();
        }
      }}
      //reference to the clicked card into order to get the cards transforms and copy it to the modal
      ref={elementRef}
    >
      <InPortal node={portalNode}>
        <div className={"card-child-container"} style={{ height: "100%" }}>
          {children}
        </div>
        {data ? <CardInfo data={data} className={cardInfoClass} /> : ""}
      </InPortal>
      {determineOut(
        children,
        cardView,
        portalNode,
        activeKey?.current == testkey
      )}
    </div>
  );
};

// function memo(
//   Component: FC<ViewCardProps>,
//   propsAreEqual?: (
//     prevProps: Readonly<PropsWithChildren<P>>,
//     nextProps: Readonly<PropsWithChildren<P>>
//   ) => boolean
// ): NamedExoticComponent<PropsWithChildren<P>>;
// function propsAreEqual(prev: Readonly<PropsWithChildren<>>,, next) {
//   if (next.toChild.includes(next.number)) { return false }
//   else if ( next.anotherProperty === next.someStaticProperty ) { return false }
//   else { return true }
//  }
// function memo<P>(
//   Component: FC<P>,
//   propsAreEqual?: (
//     prevProps: Readonly<PropsWithChildren<P>>,
//     nextProps: Readonly<PropsWithChildren<P>>
//   ) => boolean
// );

// const propsAreEqual<P> = (
//   prevProps: Readonly<PropsWithChildren<P>>,
//   nextProps: Readonly<PropsWithChildren<P>>
//  ):boolean => {

//  }
function propsAreEqual(
  prevProps: Readonly<PropsWithChildren<ViewCardProps>>,
  nextProps: Readonly<PropsWithChildren<ViewCardProps>>
): boolean {
  console.log(prevProps.data);
  console.log(nextProps.data);
  console.log("HELLO FROM PROPS ARE EQUAL");
  // if (prevProps.data?.src == nextProps.data?.src) {
  //   return false;
  // }
  return true;
}
export default React.memo(ViewCard);
// export default React.memo(ViewCard, propsAreEqual);
