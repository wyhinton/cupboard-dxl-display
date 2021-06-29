import React, {
  useState,
  useEffect,
  useRef,
  createContext,
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
import TestModal from "../TestModal";
import type { HtmlPortalNode } from "react-reverse-portal";
import { Component } from "evergreen-ui/node_modules/@types/react";
import { Transition } from "react-transition-group";
import IXDrop from "../IXDrop";
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
    console.log("ele erf us effect");
    const boundingRect =
      elementRef.current?.parentElement?.getBoundingClientRect();
    setTargetBoundingBox(boundingRect);
  }, [elementRef.current?.parentElement?.style]);

  const appModeState = useStoreState((state) => state.appModel.appMode);
  const [cardView, setCardView] = useState(CardView.NORMAL);
  const [targetBoundingBox, setTargetBoundingBox] =
    useState<undefined | DOMRect>();

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

  const portalNode = React.useMemo(() => createHtmlPortalNode(), []);

  const onLongPress = (): void => {
    const boundingRect =
      elementRef.current?.parentElement?.getBoundingClientRect();
    setTargetBoundingBox(boundingRect);
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
    rect: DOMRect | undefined,
    isActive: boolean
  ): ReactElement => {
    //if in preview mode or full screen mode render card to the portal
    if (
      (view === CardView.PREVIEW || view === CardView.FULL_SCREEN) &&
      isActive
    ) {
      console.log("passed");
      return (
        <TestModal
          text={"hello"}
          portal={node}
          boundingRect={targetBoundingBox}
          mode={view}
        ></TestModal>
      );
    } else {
      console.log("did not pass");
      return <OutPortal node={node}></OutPortal>;
    }
  };

  const getDroppableId = (receivedData: CardData | undefined): string => {
    console.log(receivedData);
    console.log(receivedData?.title);
    if (receivedData) {
      return receivedData.title;
    } else {
      return "not card data";
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
        targetBoundingBox,
        activeKey?.current == testkey
      )}
    </div>
  );
};

export default ViewCard;
const ComponentA = ({ portal }: { portal: HtmlPortalNode<Component<any>> }) => {
  return <OutPortal node={portal} />;
};
