import React, {
  PropsWithChildren,
  useState,
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
import { DeleteIcon } from "evergreen-ui";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import { AddIcon } from "evergreen-ui";
import { useDraggable } from "@dnd-kit/core";
import { DndTypes } from "../../enums";
interface ViewCardProps {
  cardType: DndTypes;
  children?: React.ReactElement[] | React.ReactElement;
  key?: string;
  activeKey?: React.MutableRefObject<string>;
  testkey?: string;
  dataGrid?: Layout;
  data?: CardData;
  setModal?: () => void;
  onDoubleClick?: React.MouseEventHandler<HTMLDivElement>;
}
/**
 * Wraps each of the cards in the card layouts, regardless of what type of card it is. T
 * Click causes the component to render to the modal view, and clicking out of that modal view sets the target
 * portal back to it's own div.
 * @component
 */

const ViewCard: FC<ViewCardProps> = ({
  cardType,
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
  const deleteCardAction = useStoreActions(
    (actions) => actions.layoutsModel.deleteCard
  );

  const cardClass = classNames("card", {
    "card-edit": appModeState === AppMode.EDIT,
    "card-display": appModeState === AppMode.DISPLAY,
    "card-preview": cardView === CardView.PREVIEW,
    "card-empty": appModeState === AppMode.EDIT && !children,
    "card-empty-hidden": !children && appModeState == AppMode.DISPLAY,
    "card-locked": cardType === DndTypes.CLOCK && appModeState === AppMode.EDIT,
  });

  const cardInfoClass = classNames("info", {
    "info-hidden": appModeState === AppMode.EDIT,
    "info-display": appModeState === AppMode.DISPLAY,
    "info-preview": cardView === CardView.PREVIEW,
  });

  //generate a portal for each card
  const portalNode = React.useMemo(
    () =>
      createHtmlPortalNode({
        attributes: { class: "card-portal", style: "height: 100%" },
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
  // https://codesandbox.io/s/dndkit-k75i3?file=/index.tsx:756-796
  // const { attributes, isDragging, transform, setNodeRef, listeners } =
  //   useDraggable({
  //     id: `test-draggable-item-${data?.sourceId}`,
  //   });

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
        if (setModal) {
          setModal();
        }
      }}
      // onMouseEnter={(e) => {
      //   console.log("entered card with id" + data?.sourceId);
      //   console.log("entered card with key" + testkey);
      // }}
      // {...attributes}
      // {...listeners}
      //reference to the clicked card into order to get the cards transforms and copy it to the modal
      ref={elementRef}
    >
      {children ? (
        <InPortal node={portalNode}>
          <div className={"card-child-container"} style={{ height: "100%" }}>
            {appModeState == AppMode.EDIT && data ? (
              <DeleteButton
                onClick={() => {
                  deleteCardAction(data);
                }}
              />
            ) : (
              <></>
            )}

            {appModeState == AppMode.EDIT && cardType == DndTypes.CLOCK ? (
              <></>
            ) : (
              children
            )}
          </div>
          {cardView === CardView.PREVIEW &&
          cardType !== DndTypes.CLOCK &&
          data ? (
            <CardInfo data={data} className={cardInfoClass} />
          ) : (
            <></>
          )}
        </InPortal>
      ) : (
        <></>
      )}

      {children ? (
        setOutPutNode(
          children,
          cardView,
          portalNode,
          activeKey?.current == testkey
        )
      ) : (
        <></>
      )}
    </div>
  );
};

//depending on the view state of the card, change its html output node
const setOutPutNode = (
  chil: ReactElement | ReactElement[],
  view: CardView,
  node: HtmlPortalNode<Component<any>>,
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

interface DeleteButtonProps {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const DeleteButton = ({ onClick }: DeleteButtonProps) => {
  const deleteButtonStyle = {
    position: "absolute",
    top: "-1em",
    left: "-1em",
    width: "fit-content",
    height: "fit-content",
    // backgroundColor: "red",
  } as React.CSSProperties;
  return (
    <div style={deleteButtonStyle} onMouseUp={onClick}>
      <DeleteIcon size={25} />
    </div>
  );
};

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
