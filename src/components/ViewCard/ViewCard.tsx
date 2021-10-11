import React, {
  PropsWithChildren,
  useState,
  useRef,
  FC,
  ReactElement,
  MouseEventHandler,
} from "react";
import CardInfo from "./CardInfo";
import CardData from "../../data_structs/CardData";
import { useStoreState, useStoreActions, useKeyboardShortcut } from "../../hooks";
import { CardView, DndTypes, AppMode, InteractionType } from "../../enums";
import classNames from "classnames";
import "../../css/viewCard.css";
import Modal from "../Modal";
import type { HtmlPortalNode } from "react-reverse-portal";
import { Component } from "evergreen-ui/node_modules/@types/react";
import { DeleteIcon, ButtonAppearance, InlineAlert } from "evergreen-ui";
import Button from "../Shared/Button";

import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";
import { Layouts } from "react-grid-layout";

interface ViewCardProperties {
  cardType: DndTypes;
  children?: React.ReactElement[] | React.ReactElement;
  activeKey?: React.MutableRefObject<string>;
  cardId?: string;
  dataGrid?: Layouts;
  layoutRef?: React.MutableRefObject<Layouts | null>;
  data?: CardData;
  onClick?: () => void;
}
/**
 * Wraps each of the cards in the card layouts, regardless of what type of card it is. T
 * Click causes the component to render to the modal view, and clicking out of that modal view sets the target
 * portal back to it's own div.
 * @component
 */

const ViewCard: FC<ViewCardProperties> = ({
  cardType,
  children,
  activeKey,
  cardId,
  data,
  onClick,
}: ViewCardProperties) => {

  const elementReference = useRef<HTMLDivElement>(null);
  const appModeState = useStoreState((state) => state.appModel.appMode);
  const [cardView, setCardView] = useState(CardView.GRID);
  const testRefCardView = useRef(CardView.GRID)

  const deleteCardAction = useStoreActions(
    (actions) => actions.layoutsModel.deleteCard
  );

  const cardClass = classNames("card", {
    "card-edit": appModeState === AppMode.EDIT,
    "card-display": appModeState === AppMode.DISPLAY,
    "card-preview": cardView === CardView.PREVIEW,
    "card-fullscreen": cardView === CardView.FULL_SCREEN,
    "card-empty": appModeState === AppMode.EDIT && !children,
    "card-empty-hidden": !children && appModeState == AppMode.DISPLAY,
    "card-locked": cardType === DndTypes.CLOCK && appModeState === AppMode.EDIT,
    "card-error": data?.failed,
  });

  const cardInfoClass = classNames("info", {
    "info-hidden": appModeState === AppMode.EDIT,
    "info-display": appModeState === AppMode.DISPLAY,
    "info-preview": cardView === CardView.PREVIEW,
  });

  const portalNodeClass = classNames("portal-node", {
    "portal-node-preview": cardView === CardView.PREVIEW,
    "portal-node-fullscreen": cardView === CardView.FULL_SCREEN,
  });

  const cardModalBackdrop = classNames("card-modal-backdrop", {
    "card-modal-backdrop-active":
      cardView === CardView.PREVIEW || cardView === CardView.FULL_SCREEN,
    "card-modal-backdrop-inactive": cardView === CardView.GRID,
  });

  const cardChildContainer = classNames("card-child-container", {
    "card-child-container-preview": cardView === CardView.PREVIEW,
    "card-child-container-fullscreen": cardView === CardView.FULL_SCREEN,
    "card-child-container-grid": cardView === CardView.GRID,
  });

  //generate a portal for each card
  // const portalNode = React.useMemo(
  //   () =>
  //     createHtmlPortalNode({
  //       // attributes: { class: portalNodeClass },
  //     }),
  //   []
  // );

  const portalNode = createHtmlPortalNode()
  const {enable, disable} = useKeyboardShortcut({
    keyCode: 27, //escape
    action: ()=>{    
      if (cardView === CardView.FULL_SCREEN || cardView === CardView.PREVIEW) {
      console.log("WAS ONE!!!");
      setCardView(CardView.GRID);
    }},
    disabled: false 
  })
  

  //change the view mode when pressing a card
  const onCardPress = (): void => {
    console.log(data?.sourceId);
    if (appModeState === AppMode.DISPLAY && cardId != undefined) {
      switch (cardView) {
        case CardView.GRID:
          cardView
          setCardView(CardView.PREVIEW);
          break;
        case CardView.PREVIEW:
          setCardView(CardView.FULL_SCREEN)
          break;
        default:
          break;
      }
    }
  };

  return (
    //receives a drag objects
    <div
      className={cardClass}
      style={{ height: "100%" }}
      ref={elementReference}
    >
      {data?.failed ? (
        <FailureNotice errors={data.validator.errorMessages()} />
      ) : (children ? (
        <InPortal node={portalNode}>
          <div
            className={cardModalBackdrop}
            onClick={(e) => {
              onCardPress()
            }}
          >
            <div
              className={cardChildContainer}
              //click the card to enter preview/fullscreen mode
              onMouseUp={() => {
                onCardPress();
                if (onClick) {
                  onClick();
                }
              }}
            >

              {
                cardView === CardView.PREVIEW && data ? (
                  <CardInfo data={data} className={cardInfoClass} />
                ) : (
                  <></>
                )
              }
              {
                //Only show layout editing controls when in edit mode and if card carries data (is not static)
                appModeState == AppMode.EDIT && data ? (
                  <DeleteButton
                    onClick={() => {
                      console.log("got delete button click");
                      deleteCardAction(data);
                    }}
                  />
                ) : (
                  <></>
                )
              }

              {
                //Don't render children of the clock widget when in edit mode
                appModeState == AppMode.EDIT && cardType == DndTypes.CLOCK ? (
                  <></>
                ) : (
                  children
                )
              }
            </div>
            {cardView === CardView.FULL_SCREEN ? (
              <ReturnButton  onClick={() => {
                setCardView(CardView.GRID);
              }}/>
            ) : (
              <></>
            )}
          </div>

        </InPortal>
      ) : (
        <></>
      ))}

      {children && !data?.failed ? (
        setOutPutNode(
          children,
          cardView,
          portalNode,
          activeKey?.current == cardId
        )
      ) : (
        <></>
      )}
    </div>
  );
};
// class App extends React.Component<{ message: string }, { count: number }> {


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
    return <Modal text={"hello"} portal={node} mode={view}></Modal>;
  } else {
    console.log("did not pass");
    return <OutPortal node={node}></OutPortal>;
  }
};

interface DeleteButtonProperties {
  onClick: React.MouseEventHandler<HTMLDivElement>;
}

const DeleteButton = ({ onClick }: DeleteButtonProperties): JSX.Element => {
  const deleteButtonStyle = {
    position: "absolute",
    top: "-1em",
    left: "-1em",
  } as React.CSSProperties;

  const subContStyle = {
    position: "absolute",
    left: -8,
  } as React.CSSProperties;
  
  return (
    <div
      style={deleteButtonStyle}
      className="delete-button-container"
      onMouseUp={onClick}
    >
      <div style={subContStyle}>
        <Button
          onClick={onClick}
          text={""}
          width={80}
          height={40}
          appearance={"danger" as ButtonAppearance}
          iconBefore={<DeleteIcon size={30} />}
        ></Button>
      </div>
    </div>
  );
};

const FailureNotice = ({ errors }: { errors: string[] }): JSX.Element => {
  return (
    <div className={"failure-notice-container"}>
      {errors.map((error, index) => (
        <div key ={index} className={"failure-message"}>
          <InlineAlert key ={index} intent="danger">{error}</InlineAlert>
        </div>
      ))}
    </div>
  );
};

const ReturnButton = ({ onClick }: {onClick: MouseEventHandler<HTMLDivElement>}): JSX.Element => {

  return(
    <div className={"return-button-container"}>
    <Button
      text={"Return"}
      width={300}
      onClick={onClick}
    />
  </div>
  )

}
function propertiesAreEqual(
  previousProperties: Readonly<PropsWithChildren<ViewCardProperties>>,
  nextProperties: Readonly<PropsWithChildren<ViewCardProperties>>
): boolean {
  return true;
}

export default React.memo(ViewCard);

