import "../../../css/viewCard.css";

import { AppMode, CardView, DndTypes, InteractionType } from "../../../enums";
import { InlineAlert } from "evergreen-ui";

import React, {
  FC,
  MouseEventHandler,
  PropsWithChildren,
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
  useOnClickOutside,
} from "../../../hooks";

import Button from "../../Shared/Button";
import CardData from "../../../data_structs/CardData";
import CardInfo from "./CardInfo";
import DeleteButton from "./DeleteButton";
import { Layouts } from "react-grid-layout";
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
import appConfig from "../../../static/appConfig";
import QRCode from "react-qr-code";
/**
 * Wraps each of the cards in the card layouts.
 * Click/Touch => Change the cards view mode
 * @component
 */
export interface CardModel {
  cardBackgroundColor: string;
  cardClass: Computed<CardModel, string>;
  cardInfoClass: Computed<CardModel, string>;
  cardType: DndTypes;
  cardView: CardView;
  handleCardPress: Thunk<CardModel>;
  scale: number;
  setBackgroundColor: Action<CardModel, string>;
  setCardView: Action<CardModel, CardView>;
  setScale: Action<CardModel, number>;
  setShowMenu: Action<CardModel, boolean>;
  showMenu: boolean;
  toggleMenu: Action<CardModel>;
  transform: Computed<CardModel, string>;
}

interface ViewCardProperties {
  activeKey?: React.MutableRefObject<string>;
  cardId?: string;
  cardType: DndTypes;
  children?: (scale: number) => ReactNode;
  data?: CardData;
  dataGrid?: Layouts;
  layoutRef?: React.MutableRefObject<Layouts | null>;
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
      scale: data?.src.includes("embed")
        ? appConfig.defaultEmbedScale
        : appConfig.defaultIframeScale,
      setScale: action((state, scale) => {
        state.scale += scale;
      }),
      cardBackgroundColor: "",
      setBackgroundColor: action((state, color) => {
        state.cardBackgroundColor = color;
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
      setShowMenu: action((state, show) => {
        state.showMenu = show;
      }),
      toggleMenu: action((state) => {
        state.showMenu = !state.showMenu;
      }),
      showMenu: false,
      cardType: cardType,
      cardClass: computed([(state) => state.cardView], (cardView) => {
        const test = classNames("card", {
          "card-edit": appModeState === AppMode.EDIT,
          "card-display":
            appModeState === AppMode.DISPLAY && cardView == CardView.GRID,
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
        // console.log("HANDLED PRESS");
        console.log(getState().cardClass);
        // console.log(appModeState);
        if (appModeState === AppMode.DISPLAY && cardId != undefined) {
          switch (getState().cardView) {
            case CardView.GRID:
              actions.setCardView(CardView.PREVIEW);
              console.log("SETTING CARD VIEW TO PREVIEW");
              break;
            case CardView.PREVIEW:
              actions.setCardView(CardView.GRID);
              break;
            default:
              break;
          }
        }
      }),
    }),
    [appModeState],
    (s) => {
      return { devTools: false };
    }
  );

  const settingsMenuProperties = {
    scale: state.scale,
    setScale: actions.setScale,
    setBackgroundColor: actions.setBackgroundColor,
    setShowMenu: actions.setShowMenu,
  };

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

  const { enable, disable } = useKeyboardShortcut({
    keyCode: 27, //escape
    action: () => {
      if (
        oldCardView === CardView.FULL_SCREEN ||
        oldCardView === CardView.PREVIEW
      ) {
        setCardView(CardView.GRID);
      }
    },
    disabled: false,
  });

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
              // toggleMenu();
              actions.toggleMenu();
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
  const containerRef = useRef(null);
  useOnClickOutside(containerRef, () => {
    if (state.cardView == CardView.PREVIEW) {
      actions.setCardView(CardView.GRID);
    }
  });

  const qrContainerStyle = {
    width: "fit-content",
    position: "absolute",
    // top: 0,
    bottom: 0,
    // left: 0,
    zIndex: 1,
    right: 0,
    transform: "translate(50%, 50%)",
  } as React.CSSProperties;

  const renderQrCode = (): JSX.Element | undefined => {
    if (state.cardView === CardView.PREVIEW && data?.src) {
      return (
        <div style={qrContainerStyle}>
          <QRCode value={data?.src ?? ""} size={128} />
        </div>
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
        backgroundColor: state.cardBackgroundColor,
      }}
      ref={cardContainerRef}
    >
      {data?.failed ? (
        <FailureNotice errors={data.validator.errorMessages()} />
      ) : children ? (
        <div className={cardModalBackdrop}>
          <div
            className={cardChildContainer}
            ref={containerRef}
            onMouseUp={() => {
              actions.handleCardPress();
              // onCardPress();
              if (onClick) {
                onClick();
              }
            }}
          >
            {renderQrCode()}
            {renderInternals()}
            {children(state.scale)}
            <SettingsMenu
              {...settingsMenuProperties}
              isShown={state.showMenu}
            />
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
