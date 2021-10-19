import "../../../css/viewCard.css";

import { AppMode, CardView, DndTypes, InteractionType } from "../../../enums";
import {
  InPortal,
  OutPortal,
  createHtmlPortalNode,
} from "react-reverse-portal";
import { InlineAlert, Position } from "evergreen-ui";
// import { Popover } from "react-tiny-popover";
import React, {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactElement,
  ReactNode,
  RefObject,
  useRef,
  useState,
} from "react";
import {
  useKeyboardShortcut,
  useStoreActions,
  useStoreState,
  useToggle,
} from "../../../hooks";

import Button from "../../Shared/Button";
import CardData from "../../../data_structs/CardData";
import CardInfo from "./CardInfo";
import { Component } from "evergreen-ui/node_modules/@types/react";
import DeleteButton from "./DeleteButton";
import type { HtmlPortalNode } from "react-reverse-portal";
import { Layouts } from "react-grid-layout";
import Modal from "../../Modal";
import SettingsButton from "./SettingsButton";
import SettingsMenu from "./SettingsMenu";
import classNames from "classnames";
import {
  Action,
  action,
  Computed,
  computed,
  Thunk,
  thunk,
  useLocalStore,
} from "easy-peasy";

/**
 * Wraps each of the cards in the card layouts, regardless of what type of card it is. T
 * Click causes the component to render to the modal view, and clicking out of that modal view sets the target
 * portal back to it's own div.
 * @component
 */
export interface CardModel {
  cardView: CardView;
  showMenu: boolean;
  cardType: DndTypes;
  scale: number;
  setScale: Action<CardModel, number>;
  transform: Computed<CardModel, string>;
  setCardView: Action<CardModel, CardView>;
  cardClass: Computed<CardModel, string>;
  cardInfoClass: Computed<CardModel, string>;
  handleCardPress: Thunk<CardModel>;
}

interface ViewCardProperties {
  cardType: DndTypes;
  children?: (scale: number) => ReactNode;
  activeKey?: React.MutableRefObject<string>;
  cardId?: string;
  dataGrid?: Layouts;
  layoutRef?: React.MutableRefObject<Layouts | null>;
  data?: CardData;
  onClick?: () => void;
}

const ViewCard: FC<ViewCardProperties> = ({
  cardType,
  children,
  activeKey,
  cardId,
  data,
  onClick,
}: ViewCardProperties) => {
  const cardContainerRef = useRef<HTMLDivElement>(null);
  const appModeState = useStoreState((state) => state.appModel.appMode);
  const [oldCardView, setCardView] = useState(CardView.GRID);
  const [showMenu, toggleMenu] = useToggle(false);
  const deleteCardAction = useStoreActions(
    (actions) => actions.layoutsModel.deleteCard
  );

  const [state, actions, store] = useLocalStore<CardModel>(
    () => ({
      cardView: CardView.GRID,
      setCardView: action((state, cardView) => {
        state.cardView = cardView;
      }),
      scale: 1.0,
      setScale: action((state, scale) => {
        state.scale += scale;
      }),
      transform: computed([(state) => state.cardView], (cardView) => {
        if (cardView == CardView.PREVIEW) {
          const boundingBox = cardContainerRef.current?.getBoundingClientRect();
          setGpZindex(cardContainerRef, 1);
          if (boundingBox) {
            return calculateTransform(boundingBox);
          }
        }
        if (cardView === CardView.GRID) {
          setGpZindex(cardContainerRef, 0);
        }
        return `translate(${0}px, ${0}px)`;
      }),
      showMenu: false,
      cardType: cardType,
      cardClass: computed([(state) => state.cardView], (cardView) => {
        const test = classNames("card", {
          "card-edit": appModeState === AppMode.EDIT,
          "card-display": appModeState === AppMode.DISPLAY,
          "card-preview": cardView === CardView.PREVIEW,
          "card-fullscreen": cardView === CardView.FULL_SCREEN,
          "card-empty": appModeState === AppMode.EDIT && !children,
          "card-empty-hidden": !children && appModeState == AppMode.DISPLAY,
          "card-locked":
            state.cardType === DndTypes.CLOCK && appModeState === AppMode.EDIT,
          "card-error": data?.failed,
        });
        console.log(test);
        return test;
      }),
      cardInfoClass: computed((state) => {
        return classNames("info", {
          "info-hidden": appModeState === AppMode.EDIT,
          "info-display": appModeState === AppMode.DISPLAY,
          "info-preview": state.cardView === CardView.PREVIEW,
        });
      }),
      handleCardPress: thunk((actions, _, { getState }) => {
        console.log("HANDLED PRESS");
        console.log(getState().cardClass);
        console.log(appModeState);
        if (appModeState === AppMode.DISPLAY && cardId != undefined) {
          switch (getState().cardView) {
            case CardView.GRID:
              // cardView;
              actions.setCardView(CardView.PREVIEW);
              break;
            case CardView.PREVIEW:
              actions.setCardView(CardView.GRID);
              // actions.setCardView(CardView.FULL_SCREEN);
              break;
            default:
              break;
          }
        }
      }),
    }),
    [appModeState]
  );

  const settingsMenuProperties = {
    scale: state.scale,
    setScale: actions.setScale,
  };

  const portalNodeClass = classNames("portal-node", {
    "portal-node-preview": oldCardView === CardView.PREVIEW,
    "portal-node-fullscreen": oldCardView === CardView.FULL_SCREEN,
  });

  const cardModalBackdrop = classNames("card-modal-backdrop", {
    "card-modal-backdrop-active":
      oldCardView === CardView.PREVIEW || oldCardView === CardView.FULL_SCREEN,
    "card-modal-backdrop-inactive": oldCardView === CardView.GRID,
  });

  const cardChildContainer = classNames("card-child-container", {
    "card-child-container-preview": state.cardView === CardView.PREVIEW,
    "card-child-container-fullscreen": state.cardView === CardView.FULL_SCREEN,
    "card-child-container-grid": state.cardView === CardView.GRID,
  });

  const portalNode = createHtmlPortalNode();
  const { enable, disable } = useKeyboardShortcut({
    keyCode: 27, //escape
    action: () => {
      if (
        oldCardView === CardView.FULL_SCREEN ||
        oldCardView === CardView.PREVIEW
      ) {
        console.log("WAS ONE!!!");
        setCardView(CardView.GRID);
      }
    },
    disabled: false,
  });

  //change the view mode when pressing a card
  // const onCardPress = (): void => {
  //   console.log(data?.sourceId);
  //   if (appModeState === AppMode.DISPLAY && cardId != undefined) {
  //     switch (oldCardView) {
  //       case CardView.GRID:
  //         oldCardView;
  //         setCardView(CardView.PREVIEW);
  //         break;
  //       case CardView.PREVIEW:
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  // };

  const showDeleteButton = (): JSX.Element | undefined => {
    if (appModeState == AppMode.EDIT && data) {
      return (
        <>
          <DeleteButton
            onClick={() => {
              console.log("got delete button click");
              deleteCardAction(data);
            }}
          />
          <SettingsButton
            onClick={(e) => {
              toggleMenu();
            }}
          />
        </>
      );
    }
  };

  const renderCardInfo = (): JSX.Element | undefined => {
    if (oldCardView === CardView.PREVIEW && data) {
      return <CardInfo data={data} className={state.cardInfoClass} />;
    }
  };

  const renderInternals = () => {
    return [showDeleteButton(), renderCardInfo()];
  };

  const renderReturnButton = (): JSX.Element | undefined => {
    if (oldCardView === CardView.FULL_SCREEN) {
      return (
        <ReturnButton
          onClick={() => {
            setCardView(CardView.GRID);
          }}
        />
      );
    }
  };


  return (
    //receives a drag objects
    <div
      className={state.cardClass}
      style={{
        willChange: "transform",
        height: "100%",
        transform: state.transform,
      }}
      ref={cardContainerRef}
    >
      {data?.failed ? (
        <FailureNotice errors={data.validator.errorMessages()} />
      ) : children ? (
        <div className={cardModalBackdrop}>
          <div
            className={cardChildContainer}
            onMouseUp={() => {
              actions.handleCardPress();
              // onCardPress();
              if (onClick) {
                onClick();
              }
            }}
          >
            {/* {renderInternals()} */}
            {children(state.scale)}
            {/* {React.c} */}
            <SettingsMenu {...settingsMenuProperties} isShown={showMenu} />
          </div>
          {renderReturnButton()}
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};
// class App extends React.Component<{ message: string }, { count: number }> {
const calculateTransform = (boundingBox: DOMRect): string => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const vw = window.innerWidth / 100;
  const vh = window.innerWidth / 100;
  const futureWidth = vw * 60;
  const futureHeight = vh * 40;

  const centeredX = windowWidth / 2 - futureWidth / 2;
  const centeredY = windowHeight / 2 - futureHeight / 2;

  const currentX = boundingBox.x;
  const currentY = boundingBox.y;
  let differenceX = centeredX - currentX;
  let differenceY = centeredY - currentY;

  if (currentX > centeredX) {
    differenceX = currentX - centeredX;
    differenceX *= -1;
  }
  if (currentY > centeredY) {
    differenceY = currentY - centeredY;
    differenceY *= -1;
  }

  return `translate(${differenceX}px, ${differenceY}px)`;
};

const setGpZindex = (
  refdiv: RefObject<HTMLDivElement> | null,
  index: number
): void => {
  if (refdiv) {
    const cardGrandParent = refdiv.current?.parentElement?.parentElement;
    if (cardGrandParent) {
      cardGrandParent.style.zIndex = index.toString();
    }
  }
};
//depending on the view state of the card, change its html output node

const FailureNotice = ({ errors }: { errors: string[] }): JSX.Element => {
  return (
    <div className={"failure-notice-container"}>
      {errors.map((error, index) => (
        <div key={index} className={"failure-message"}>
          <InlineAlert key={index} intent="danger">
            {error}
          </InlineAlert>
        </div>
      ))}
    </div>
  );
};

const ReturnButton = ({
  onClick,
}: {
  onClick: MouseEventHandler<HTMLDivElement>;
}): JSX.Element => {
  return (
    <div className={"return-button-container"}>
      <Button text={"Return"} width={300} onClick={onClick} />
    </div>
  );
};
function propertiesAreEqual(
  previousProperties: Readonly<PropsWithChildren<ViewCardProperties>>,
  nextProperties: Readonly<PropsWithChildren<ViewCardProperties>>
): boolean {
  return true;
}

export default React.memo(ViewCard);
