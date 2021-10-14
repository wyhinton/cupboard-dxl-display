import Button from '../../Shared/Button';
import CardData from '../../../data_structs/CardData';
import CardInfo from './CardInfo';
import classNames from 'classnames';
import DeleteButton from './DeleteButton';
import Modal from '../../Modal';
import {
  AppMode,
  CardView,
  DndTypes,
  InteractionType
  } from '../../../enums';
import { InlineAlert } from 'evergreen-ui';
import { Component } from 'evergreen-ui/node_modules/@types/react';
import { Layouts } from 'react-grid-layout';
import { useKeyboardShortcut, useStoreActions, useStoreState } from '../../../hooks';
import '../../../css/viewCard.css';
import React, {
  PropsWithChildren,
  useState,
  useRef,
  FC,
  ReactElement,
  MouseEventHandler,
} from "react";
import type { HtmlPortalNode } from "react-reverse-portal";
import {
  createHtmlPortalNode,
  InPortal,
  OutPortal,
} from "react-reverse-portal";

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

  const showDeleteButton = (): JSX.Element | undefined  =>{
    if (    appModeState == AppMode.EDIT && data ){
      return       <DeleteButton
      onClick={() => {
        console.log("got delete button click");
        deleteCardAction(data);
      }}
    />
    }
  }
  const renderCardInfo = (): JSX.Element | undefined  =>{
    if(cardView === CardView.PREVIEW && data ){
        return <CardInfo data={data} className={cardInfoClass} />
    }
  }

  const renderInternals = () =>{
    return [showDeleteButton(), renderCardInfo()]
  }

  const renderReturnButton = (): JSX.Element | undefined =>{
    if (cardView === CardView.FULL_SCREEN){
      return       <ReturnButton  onClick={() => {
        setCardView(CardView.GRID);
      }}/>
    }
  }

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
          >
            <div
              className={cardChildContainer}
              onMouseUp={() => {
                onCardPress();
                if (onClick) {
                  onClick();
                }
              }}
            >
              {renderInternals()}
              {children}
            </div>
              {renderReturnButton()}
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

