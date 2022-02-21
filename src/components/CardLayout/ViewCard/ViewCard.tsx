import "../../../css/viewCard.css";

import classNames from "classnames";
import type { Action, Computed, Thunk } from "easy-peasy";
import { action, computed, thunk, useLocalStore } from "easy-peasy";
import { InlineAlert } from "evergreen-ui";
import { motion } from "framer-motion";
import React, {
  FC,
  MouseEventHandler,
  PropsWithChildren,
  ReactNode,
  RefObject,
  SyntheticEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Layouts } from "react-grid-layout";
import QRCode from "react-qr-code";

import CardData from "../../../data_structs/CardData";
import WidgetData from "../../../data_structs/WidgetData";
import { AppMode, CardView, DndTypes } from "../../../enums";
import {
  useApp,
  useKeyboardShortcut,
  useLayout,
  useOnClickOutside,
} from "../../../hooks";
import appConfig from "../../../static/appConfig";
import { randomNumber } from "../../../utils";
import Button from "../../Shared/Button";
import CardInfo from "./CardInfo";
import DeleteButton from "./DeleteButton";
import SettingsButton from "./SettingsButton";
import SettingsMenu from "./SettingsMenu";
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
  // transform: Computed<CardModel, string>;
}

export type CardErrorHandler = (
  e: SyntheticEvent<HTMLDivElement | HTMLIFrameElement | HTMLImageElement>,
  card: CardData
) => void;
export type CardLoadHandler = (
  e: SyntheticEvent<HTMLDivElement | HTMLIFrameElement | HTMLImageElement>,
  card: CardData
) => void;

interface ViewCardProperties {
  // activeKey?: React.MutableRefObject<string>;
  cardId?: string;
  cardType: DndTypes;
  useAnimation: boolean;
  //pass a set of information to all child components
  children?: (
    scale: number,
    cardView: CardView,
    onError: CardErrorHandler,
    onLoad: CardLoadHandler
  ) => ReactNode;
  data?: CardData | WidgetData;
  dataGrid?: Layouts;
  layoutRef?: React.MutableRefObject<Layouts | null>;
  onClick?: () => void;
}

const ViewCard: FC<ViewCardProperties> = ({
  cardType,
  children,
  // activeKey,
  cardId,
  data,
  onClick,
  useAnimation,
}: ViewCardProperties) => {
  const cardContainerReference = useRef<HTMLDivElement>(null);
  // const appMode = useStoreState((state) => state.appModel.appMode);
  const { appMode, addAppError } = useApp();
  const { deleteCard } = useLayout();
  const [oldCardView, setCardView] = useState(CardView.GRID);
  const [isError, setIsError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeChildren, setActiveChildren] = useState<ReactNode>();

  const [state, actions] = useLocalStore<CardModel>(
    () => ({
      cardView: CardView.GRID,
      setCardView: action((state, cardView) => {
        state.cardView = cardView;
      }),
      scale:
        data?.contentType === "embed"
          ? appConfig.defaultEmbedScale
          : appConfig.defaultIframeScale,
      setScale: action((state, scale) => {
        state.scale += scale;
      }),
      cardBackgroundColor: "",
      setBackgroundColor: action((state, color) => {
        state.cardBackgroundColor = color;
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
          "card-edit": appMode === AppMode.EDIT,
          "card-display":
            appMode === AppMode.DISPLAY && cardView == CardView.GRID,
          "card-preview": cardView === CardView.PREVIEW,
          "card-fullscreen": cardView === CardView.FULL_SCREEN,
          "card-empty": appMode === AppMode.EDIT && !children,
          "card-empty-hidden": !children && appMode == AppMode.DISPLAY,
          "card-locked":
            state.cardType === DndTypes.CLOCK && appMode === AppMode.EDIT,
          // "card-error": data?.failed,
        });
        return test;
      }),
      cardInfoClass: computed((state) => {
        return classNames("info", {
          "info-hidden": appMode === AppMode.EDIT,
          "info-display": appMode === AppMode.DISPLAY,
          "info-preview": state.cardView === CardView.PREVIEW,
        });
      }),
      handleCardPress: thunk((actions, _, { getState }) => {
        // console.log("HANDLED PRESS");
        // console.log(getState().cardClass);
        // console.log(appMode);
        const rootel = document.getElementById("root") as HTMLDivElement;
        if ((rootel.style.pointerEvents = "all")) {
          rootel.style.pointerEvents = "none";
        }

        setTimeout(() => {
          rootel.style.pointerEvents = "all";
        }, 1000);
        if (appMode === AppMode.DISPLAY && cardId != undefined) {
          switch (getState().cardView) {
            case CardView.GRID:
              if (data?.contentType !== "widget") {
                actions.setCardView(CardView.PREVIEW);
                const el = document.getElementById(
                  data?.id ?? "view_card"
                ) as HTMLDivElement;
                el.style.zIndex = "1000";
              }
              // console.log(data);

              break;
            case CardView.PREVIEW:
              actions.setCardView(CardView.GRID);
              const el = document.getElementById(
                data?.id ?? "view_card"
              ) as HTMLDivElement;
              el.style.zIndex = "0";
              break;
            default:
              break;
          }
        }
      }),
    }),
    [appMode],
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
    if (appMode == AppMode.EDIT && data) {
      return (
        <>
          <DeleteButton
            onClick={() => {
              deleteCard(data.id);
            }}
            action={() => {
              deleteCard(data.id);
            }}
          />
          <SettingsButton
            onClick={(e) => {
              actions.toggleMenu();
            }}
          />
        </>
      );
    }
  };

  const renderCardInfo = (): JSX.Element | undefined => {
    if (
      oldCardView === CardView.PREVIEW &&
      data &&
      data.contentType !== "widget"
    ) {
      return (
        <CardInfo className={state.cardInfoClass} data={data as CardData} />
      );
    }
  };

  const renderInternals = () => {
    if (data?.contentType !== "widget") {
      return [showDeleteButton(), renderCardInfo()];
    } else {
      return [showDeleteButton()];
    }
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

  const containerReference = useRef(null);
  useOnClickOutside(containerReference, (e) => {
    e.preventDefault();
    if (state.cardView == CardView.PREVIEW) {
      actions.setCardView(CardView.GRID);
    }
  });

  const qrContainerStyle = {
    width: "fit-content",
    position: "absolute",
    bottom: 0,
    zIndex: 1,
    right: 0,
    transform: "translate(50%, 50%)",
  } as React.CSSProperties;

  const renderQrCode = (): JSX.Element | undefined => {
    if (state.cardView === CardView.PREVIEW && data?.contentType !== "widget") {
      const cd = data as CardData;
      return (
        <div style={qrContainerStyle}>
          <QRCode size={128} value={cd?.src ?? ""} />
        </div>
      );
    }
  };

  const onError: CardErrorHandler = (event, card) => {
    // addAppError({
    //   errorType: "failed to load content",
    //   description: "description",
    // });
    const { title, src } = card;
    addAppError({
      errorType: "failed to load content",
      description: "description",
      source: `Card: ${title}`,
      link: src,
    });
    setIsError(true);

    // console.log("Got Error");
  };

  const onLoad: CardLoadHandler = (event, card) => {
    if (appMode === AppMode.DISPLAY) {
      setAnimationVariant("loaded");
    }

    setIsLoaded(true);
    // console.log("Got Error");
  };

  useEffect(() => {
    if (cardContainerReference.current) {
      const cardGrandParent =
        cardContainerReference.current?.parentElement?.parentElement;
      // console.log(cardGrandParent);
      if (cardGrandParent) {
        cardGrandParent.id = data?.id ?? "view_card";
      }
    }
  }, []);

  const jj = useMemo(() => {
    if (cardContainerReference.current) {
      const rect = cardContainerReference.current.getBoundingClientRect();
      return calculateTransform2(rect);
    }
    // setVx(calculateTransform2(rect));
  }, [state.cardView]);

  useEffect(() => {
    if (state.cardView === CardView.PREVIEW) {
      setAnimationVariant("preview");
    }
    if (state.cardView === CardView.GRID) {
      setAnimationVariant("none");
    }
    // if (state.)
  }, [state.cardView]);

  const variants = {
    active: {
      opacity: 1,
      transition: {
        delay: randomNumber(0.4, 0.5),
        duration: 0.5,
      },
    },
    preview: {
      opacity: 1,
      transition: {
        duration: 0.2,
      },
    },
    normal: {
      opacity: 1,
    },
    none: {
      opacity: 1,
      x: 0,
      y: 0,
    },
    error: {
      // border: "1px solid red",
      opacity: [1, 0],
      backgroundColor: "red",
      // transition:
    },
    loaded: {
      // border: "1px solid red",
      outline: [`0px solid green`, `4px solid green`, `0px solid green`],
      opacity: 1,
      transition: {
        delay: randomNumber(0.4, 0.5),
        duration: 0.5,
      },
      x: 0,
      y: 0,
      // backgroundColor: "green",
      // transition:
    },
    in: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: randomNumber(0.4, 1.5),
        // ease: "easeOut",
      },
    },
    // out: {
    //   y: randomNumber(-50, 50),
    //   opacity: [1, 0],
    //   transition: {
    //     delay: randomNumber(0.4, 1.5),
    //     duration: 0.5,
    //   },
    // },
  };

  const [animationVariant, setAnimationVariant] = useState("none");
  // const [animate, setAnimate] = useState("in");
  useEffect(() => {
    // console.log(children);
    if (children) {
      if (useAnimation) {
        setAnimationVariant("out");
        setTimeout(() => {
          setAnimationVariant("in");
          setActiveChildren(
            children(state.scale, state.cardView, onError, onLoad)
          );
        }, 500);
      } else {
        setAnimationVariant("none");
        setActiveChildren(
          children(state.scale, state.cardView, onError, onLoad)
        );
      }
    }
  }, [children]);
  // }, [children, state.cardView]);

  return (
    <motion.div
      ref={cardContainerReference}
      layoutId="viewcard"
      className={state.cardClass}
      style={{
        transformOrigin: "center",
        willChange: "transform",
        height: "100%",
        backgroundColor: state.cardBackgroundColor,
        opacity: appMode === AppMode.DISPLAY ? 0 : 1,
        // y: appMode === AppMode.DISPLAY ? randomNumber(100, 0) : 0,
        y: 0,
      }}
      initial={appMode === AppMode.EDIT ? false : true}
      variants={variants}
      // eslint-disable-next-line react/jsx-sort-props
      animate={animationVariant}
    >
      {children && (
        <div className={cardModalBackdrop}>
          <div
            className={cardChildContainer}
            onMouseUp={() => {
              actions.handleCardPress();
              if (onClick) {
                onClick();
              }
            }}
            ref={containerReference}
          >
            {/* {renderQrCode()} */}
            {renderInternals()}
            {activeChildren}
            <SettingsMenu
              {...settingsMenuProperties}
              isShown={state.showMenu}
            />
          </div>
          {renderReturnButton()}
        </div>
      )}
    </motion.div>
  );
};
// class App extends React.Component<{ message: string }, { count: number }> {

const calculateTransform2 = (boundingBox: DOMRect): [number, number] => {
  const windowWidth = window.innerWidth;
  const windowHeight = window.innerHeight;
  const vw = window.innerWidth / 100;
  const vh = window.innerWidth / 100;
  // const futureWidth = vw * 60;
  // const futureHeight = vh * 40;
  const futureWidth = boundingBox.width * 1.5;
  const futureHeight = boundingBox.height * 1.5;

  const centeredX = windowWidth / 2 - futureWidth / 2;
  const centeredY = windowHeight / 2 - futureHeight / 2;

  const currentX = boundingBox.x;
  const currentY = boundingBox.y;
  let differenceX = centeredX - currentX;
  let differenceY = centeredY - currentY;

  if (centeredX < currentX) {
    differenceX = currentX - centeredX;
    differenceX *= -1;
  }
  if (centeredY < currentY) {
    differenceY = currentY - centeredY;
    differenceY *= -1;
  }
  return [differenceX, differenceY];
  // return `translate(${differenceX}px, ${differenceY}px)`;
};

const setGpZindex = (
  refdiv: RefObject<HTMLDivElement> | null,
  index: number
): void => {
  if (refdiv) {
    const cardGrandParent = refdiv.current?.parentElement?.parentElement;
    // console.log(cardGrandParent);
    if (cardGrandParent) {
      cardGrandParent.style.zIndex = index.toString();
    }
  }
};
// const setGpZindex1 = (
//   refdiv: HTMLDivElement,
//   zIndex: number
// ): void => {
//   if (refdiv) {
//       cardGrandParent.style.zIndex = zIndex.toString();
//   }
// };
//depending on the view state of the card, change its html output node

const FailureNotice = ({ errors }: { errors: string[] }): JSX.Element => {
  return (
    <div className="failure-notice-container">
      {errors.map((error, index) => (
        <div className="failure-message" key={index}>
          <InlineAlert intent="danger" key={index}>
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
    <div className="return-button-container">
      <Button onClick={onClick} text="Return" width={300} />
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
