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
import { useStoreState, useStoreActions } from "../../hooks";
import { CardView, DndTypes, AppMode } from "../../enums";
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
import { Layouts } from "react-grid-layout";
interface ViewCardProps {
  cardType: DndTypes;
  children?: React.ReactElement[] | React.ReactElement;
  key?: string;
  activeKey?: React.MutableRefObject<string>;
  testkey?: string;
  dataGrid?: Layouts;
  layoutRef?: React.MutableRefObject<Layouts | null>;
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
  layoutRef,
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
          console.log("got default");
          break;
      }
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
        if (setModal) {
          setModal();
        }
      }}
      ref={elementRef}
    >
      {children ? (
        <InPortal node={portalNode}>
          <div className={"card-child-container"} style={{ height: "100%" }}>
            {appModeState == AppMode.EDIT && data ? (
              <DeleteButton
                onClick={() => {
                  console.log("got delete button click");
                  deleteCardAction(data);
                }}
                // onClick={() => {
                //   console.log("clicked delete button");
                //   onDoubleClick;

                //   // console.log(layoutRef);
                //   // if (layoutRef) {
                //   //   const old = { ...layoutRef.current };
                //   //   for (const [k, v] of Object.entries(old)) {
                //   //     // let newItem: Layout = {
                //   //     //   x: pos.x,
                //   //     //   y: pos.y,
                //   //     //   w: 1,
                //   //     //   h: 1,
                //   //     //   i: toAdd.sourceId,
                //   //     // };
                //   //     old[k] = v.filter((l) => l.i !== data.sourceId);
                //   //     console.log(v.filter((l) => l.i !== data.sourceId));
                //   //   }

                //   //   layoutRef.current = old;
                //   //   console.log(layoutRef.current);
                //   //   // layoutRef.current = old.filter(
                //   //   (l) => l.i === data.sourceId
                //   // );
                //   // for (const [k, v] of Object.entries(layoutRef.current)) {
                //   //   let newItem: Layout = {
                //   //     x: pos.x,
                //   //     y: pos.y,
                //   //     w: 1,
                //   //     h: 1,
                //   //     i: toAdd.sourceId,
                //   //   };
                //   //   this.layout[k].push(newItem);
                //   // }
                // }}
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
