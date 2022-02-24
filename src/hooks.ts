import type { ActionCreator, ThunkCreator } from "easy-peasy";
import { createTypedHooks } from "easy-peasy";
import type { EffectCallback, RefObject } from "react";
import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import type CardData from "./data_structs/CardData";
import type LayoutData from "./data_structs/LayoutData";
import type WidgetData from "./data_structs/WidgetData";
import type { AppMode } from "./enums";
import type AppError from "./interfaces/AppError";
import type { CardAddEvent, CardSwapEvent } from "./interfaces/CardEvents";
import type { StoreModel } from "./model";

const appModelHooks = createTypedHooks<StoreModel>();

export const useStoreActions = appModelHooks.useStoreActions;
export const useStoreDispatch = appModelHooks.useStoreDispatch;
export const useStoreState = appModelHooks.useStoreState;

export function useToggle(initialValue: boolean): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggleValue = () => setValue(!value);

  return [value, toggleValue];
}

interface UseCardEditorProperties {
  editingCard: CardData | undefined;
  setEditingCard: ActionCreator<CardData | undefined>;
  setCardScale: ActionCreator<{
    cardId: string;
    scale: number;
  }>;
  setCardBackgroundColor: ActionCreator<{
    cardId: string;
    color: string;
  }>;
  setCardContentFit: ActionCreator<{
    cardId: string;
    contentFit: string;
  }>;
  clearEditingCard: () => void;
  cardScale: number | undefined;
  cardBackgroundColor: string | undefined;
  cardContentFit: string | undefined;
}

export const useCardEditor = (): UseCardEditorProperties => {
  const { setCardScale, setCardBackgroundColor, setCardContentFit } =
    useStoreActions((actions) => actions.layoutsModel);
  const { setEditingCard } = useStoreActions((actions) => actions.appModel);
  const { editingCard } = useStoreState((state) => state.appModel);
  const { cardScale, cardBackgroundColor, cardContentFit } = useStoreState(
    (state) => state.layoutsModel
  );

  const clearEditingCard = () => {
    // eslint-disable-next-line unicorn/no-useless-undefined
    setEditingCard(undefined);
  };

  return {
    setEditingCard,
    editingCard,
    setCardScale,
    setCardBackgroundColor,
    clearEditingCard,
    cardScale,
    cardBackgroundColor,
    cardContentFit,
    setCardContentFit,
  };
};

interface UseAppSettingsProperties {
  rotationSpeed: number;
  enableQrCodes: boolean;
  rotateLayouts: boolean;
  enableIframeAudio: boolean;
  enableIframeInteractions: boolean;
  setRotationSpeed: ActionCreator<number>;
  setShowQrCodes: ActionCreator<boolean>;
  setBlockIframeInteractions: ActionCreator<boolean>;
  setMuteIframeAudio: ActionCreator<boolean>;
  setRotateLayouts: ActionCreator<boolean>;
}

export const useAppSettings = (): UseAppSettingsProperties => {
  const setRotationSpeed = useStoreActions(
    (actions) => actions.appSettingsModel.setRotationSpeed
  );
  const setShowQrCodes = useStoreActions(
    (actions) => actions.appSettingsModel.setShowQrCodes
  );
  const setBlockIframeInteractions = useStoreActions(
    (actions) => actions.appSettingsModel.setEnableIframeInteractions
  );
  const setMuteIframeAudio = useStoreActions(
    (state) => state.appSettingsModel.setEnableIframeAudio
  );
  const setRotateLayouts = useStoreActions(
    (actions) => actions.appSettingsModel.setRotateLayouts
  );
  const rotationSpeed = useStoreState(
    (state) => state.appSettingsModel.rotationSpeed
  );
  const enableIframeAudio = useStoreState(
    (state) => state.appSettingsModel.enableIframeAudio
  );
  const rotateLayouts = useStoreState(
    (state) => state.appSettingsModel.rotateLayouts
  );
  const enableQrCodes = useStoreState(
    (state) => state.appSettingsModel.enableQrCodes
  );
  const enableIframeInteractions = useStoreState(
    (state) => state.appSettingsModel.enableIframeInteractions
  );

  return {
    rotationSpeed,
    enableQrCodes,
    enableIframeInteractions,
    rotateLayouts,
    enableIframeAudio,
    setRotationSpeed,
    setShowQrCodes,
    setBlockIframeInteractions,
    setRotateLayouts,
    setMuteIframeAudio,
  };
};

interface UseSheetsProperties {
  fetchTopLevelSheet: ThunkCreator<void, any>;

  parentSheetUrl: string | undefined;
  cardSheetUrl: string | undefined;
  layoutSheetUrl: string | undefined;
  formUrl: string | undefined;
}

export const useSheets = (): UseSheetsProperties => {
  const fetchTopLevelSheet = useStoreActions(
    (actions) => actions.googleSheetsModel.fetchTopLevelSheet
  );
  const parentSheetUrl = useStoreState(
    (state) => state.googleSheetsModel.cardSheetUrl
  );

  const cardSheetUrl = useStoreState(
    (state) => state.googleSheetsModel.cardSheetUrl
  );
  const layoutSheetUrl = useStoreState(
    (state) => state.googleSheetsModel.layoutSheetUrl
  );
  const formUrl = useStoreState((state) => state.googleSheetsModel.formUrl);

  return {
    fetchTopLevelSheet,
    parentSheetUrl,
    cardSheetUrl,
    layoutSheetUrl,
    formUrl,
  };
};

interface UseErrorProperties {
  appErrors: AppError[];
  layoutErrors: AppError[];
  googleSheetsErrors: AppError[];
  allErrors: AppError[];
}

export const useErrors = (): UseErrorProperties => {
  const appErrors = useStoreState((state) => state.appModel.appErrors);
  const layoutErrors = useStoreState(
    (state) => state.layoutsModel.layoutErrors
  );
  const googleSheetsErrors = useStoreState(
    (state) => state.googleSheetsModel.googleSheetsErrors
  );
  const allErrors = [...appErrors, ...layoutErrors, ...googleSheetsErrors];
  return {
    appErrors,
    layoutErrors,
    googleSheetsErrors,
    allErrors,
  };
};

interface UseAppProperties {
  appMode: AppMode;
  rotationSpeed: number;
  setRotationSpeed: ActionCreator<number>;
  transitionLayout: ThunkCreator<number, any>;
  toggleAppMode: ThunkCreator<void, any>;
  setRotateLayouts: ActionCreator<boolean>;
  rotateLayouts: boolean;
  addAppError: ActionCreator<AppError>;
  sheetsAreLoaded: boolean;
  editingCard: CardData | undefined;
  setEditingCard: ActionCreator<CardData>;
}

export const useApp = (): UseAppProperties => {
  const toggleAppMode = useStoreActions(
    (actions) => actions.appModel.toggleAppMode
  );

  const rotationSpeed = useStoreState((state) => state.appModel.rotationSpeed);
  const editingCard = useStoreState((state) => state.appModel.editingCard);
  const rotateLayouts = useStoreState((state) => state.appModel.rotateLayouts);
  const sheetsAreLoaded = useStoreState(
    (state) => state.googleSheetsModel.sheetsAreLoaded
  );

  const setRotationSpeed = useStoreActions(
    (actions) => actions.appModel.setRotationSpeed
  );
  const transitionLayout = useStoreActions(
    (actions) => actions.layoutsModel.transitionLayout
  );
  const setRotateLayouts = useStoreActions(
    (actions) => actions.appModel.setRotateLayouts
  );
  const addAppError = useStoreActions(
    (actions) => actions.appModel.addAppError
  );
  const setEditingCard = useStoreActions(
    (actions) => actions.appModel.setEditingCard
  );
  const appMode = useStoreState((state) => state.appModel.appMode);

  return {
    appMode,
    rotationSpeed,
    setRotationSpeed,
    editingCard,
    toggleAppMode,
    rotateLayouts,
    setRotateLayouts,
    addAppError,
    sheetsAreLoaded,
    transitionLayout,
    setEditingCard,
    // animationCounter,
  };
};

interface useLayoutProperties {
  activeCards: CardData[];
  activeWidgets: WidgetData[];
  setBufferLayout: ActionCreator<ReactGridLayout.Layouts>;
  activeLayout: LayoutData | undefined;
  deleteCard: ThunkCreator<string, any>;
  addCard: ThunkCreator<CardAddEvent, any>;
  swapCard: ThunkCreator<CardSwapEvent, any>;
  // addWidget: ThunkCreator<CardAddEvent, any>;
  setActiveLayout: ActionCreator<LayoutData>;
  useNextLayout: ThunkCreator<void, any>;
  clearCards: ThunkCreator<void, any>;
  resetLayout: ThunkCreator<void, any>;
  externalLayouts: LayoutData[];
}

export const useLayout = (): useLayoutProperties => {
  const activeCards = useStoreState((state) => state.appModel.activeCards);
  const activeWidgets = useStoreState((state) => state.appModel.activeWidgets);
  const externalLayouts = useStoreState(
    (state) => state.layoutsModel.externalLayouts
  );
  const swapCard = useStoreActions(
    (actions) => actions.layoutsModel.swapCardContent
  );

  // const addWidget = useStoreActions(
  //   (actions) => actions.layoutsModel.addWidget
  // );

  const deleteCard = useStoreActions(
    (actions) => actions.layoutsModel.deleteCard
  );
  const addCard = useStoreActions((actions) => actions.layoutsModel.addCard);

  const setBufferLayout = useStoreActions(
    (actions) => actions.layoutsModel.setBufferLayout
  );
  // const set
  const activeLayout = useStoreState(
    (state) => state.layoutsModel.activeLayout
  );

  const useNextLayout = useStoreActions(
    (actions) => actions.layoutsModel.setNextLayout
  );

  const setActiveLayout = useStoreActions(
    (actions) => actions.layoutsModel.setActiveLayout
  );
  const clearCards = useStoreActions(
    (actions) => actions.layoutsModel.clearCards
  );

  const resetLayout = useStoreActions(
    (actions) => actions.layoutsModel.resetLayout
  );

  return {
    activeCards,
    activeWidgets,
    setBufferLayout,
    activeLayout,
    deleteCard,
    addCard,
    swapCard,
    // addWidget,
    setActiveLayout,
    useNextLayout,
    clearCards,
    resetLayout,
    externalLayouts,
  };
};
export const useKeyboardShortcut = ({
  keyCode,
  action,
  disabled,
}: {
  keyCode: number;
  action: (event: KeyboardEvent) => void;
  disabled: boolean;
}): { enable: () => void; disable: () => void } => {
  React.useEffect(() => {
    if (!disabled) {
      enable();
    }
    return () => {
      disable();
    };
  });

  const enable = () => {
    document.addEventListener("keydown", handleAction);
  };

  const disable = () => {
    document.removeEventListener("keydown", handleAction);
  };

  const handleAction = (e: KeyboardEvent) => {
    if (e.keyCode === keyCode) {
      e.preventDefault();
      action(e);
    }
  };

  return { enable, disable };
};

type AnyEvent = MouseEvent | TouchEvent;

export function useOnClickOutside<T extends HTMLElement = HTMLElement>(
  reference: RefObject<T>,
  handler: (event: AnyEvent) => void
): void {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const element = reference?.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!element || element.contains(event.target as Node)) {
        return;
      }

      handler(event);
    };

    document.addEventListener(`mousedown`, listener);
    document.addEventListener(`touchstart`, listener);

    return () => {
      // \

      document.removeEventListener(`mousedown`, listener);
      document.removeEventListener(`touchstart`, listener);
    };

    // Reload only if ref or handler changes
  }, [reference, handler]);
}

export function useEffectOnce(effect: EffectCallback) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(effect, []);
}

export function useTimeout(
  callback: () => void,
  delay: number | null
): { reset: () => void; stop: () => void } {
  const savedCallback = useRef(callback);
  const timeOutReference = useRef<NodeJS.Timeout>();

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setTimeout(() => savedCallback.current(), delay);
    timeOutReference.current = id;
    return () => clearTimeout(id);
  }, [delay]);

  const reset = useCallback(() => {
    if (timeOutReference.current && delay) {
      clearTimeout(timeOutReference.current);
      timeOutReference.current = setTimeout(savedCallback.current, delay);
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (timeOutReference.current) {
      clearTimeout(timeOutReference.current);
    }
  }, []);

  return { reset, stop };
}
export function useInterval(
  callback: () => void,
  delay: number | null
): { reset: () => void; stop: () => void } {
  const savedCallback = useRef(callback);
  const intervalReference = useRef<NodeJS.Timeout>();

  // Remember the latest callback if it changes.
  useLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    // Don't schedule if no delay is specified.
    // Note: 0 is a valid value for delay.
    if (!delay && delay !== 0) {
      return;
    }

    const id = setInterval(() => savedCallback.current(), delay);
    intervalReference.current = id;
    return () => clearInterval(id);
  }, [delay]);

  const reset = useCallback(() => {
    if (intervalReference.current && delay) {
      clearInterval(intervalReference.current);
      intervalReference.current = setInterval(savedCallback.current, delay);
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (intervalReference.current) {
      clearInterval(intervalReference.current);
    }
  }, []);

  return { reset, stop };
}

function useEventListener<K extends keyof WindowEventMap>(
  eventName: K,
  handler: (event: WindowEventMap[K]) => void
): void;
function useEventListener<
  K extends keyof HTMLElementEventMap,
  T extends HTMLElement = HTMLDivElement
>(
  eventName: K,
  handler: (event: HTMLElementEventMap[K]) => void,
  element: RefObject<T>
): void;

function useEventListener<
  KW extends keyof WindowEventMap,
  KH extends keyof HTMLElementEventMap,
  T extends HTMLElement | void = void
>(
  eventName: KW | KH,
  handler: (
    event: WindowEventMap[KW] | HTMLElementEventMap[KH] | Event
  ) => void,
  element?: RefObject<T>
) {
  // Create a ref that stores handler
  const savedHandler = useRef<typeof handler>();

  useEffect(() => {
    // Define the listening target
    const targetElement: T | Window = element?.current || window;
    if (!(targetElement && targetElement.addEventListener)) {
      return;
    }

    // Update saved handler if necessary
    if (savedHandler.current !== handler) {
      savedHandler.current = handler;
    }

    // Create event listener that calls handler function stored in ref
    const eventListener: typeof handler = (event) => {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!savedHandler?.current) {
        savedHandler.current(event);
      }
    };

    targetElement.addEventListener(eventName, eventListener);

    // Remove event listener on cleanup
    return () => {
      targetElement.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element, handler]);
}

// See: https://usehooks-ts.com/react-hook/use-event-listener

interface Size {
  width: number;
  height: number;
}

export function useElementSize<T extends HTMLElement = HTMLDivElement>(): [
  (node: T | null) => void,
  Size
] {
  // Mutable values like 'ref.current' aren't valid dependencies
  // because mutating them doesn't re-render the component.
  // Instead, we use a state as a ref to be reactive.
  const [reference, setReference] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  // Prevent too many rendering using useCallback
  const handleSize = useCallback(() => {
    setSize({
      width: reference?.offsetWidth || 0,
      height: reference?.offsetHeight || 0,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference?.offsetHeight, reference?.offsetWidth]);

  useEventListener("resize", handleSize);

  useLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reference?.offsetHeight, reference?.offsetWidth]);

  return [setReference, size];
}

export function useHover<T extends HTMLElement = HTMLElement>(
  elementReference: RefObject<T>
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEventListener("mouseenter", handleMouseEnter, elementReference);
  useEventListener("mouseleave", handleMouseLeave, elementReference);

  return value;
}

interface WindowSize {
  width: number;
  height: number;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: 0,
    height: 0,
  });

  const handleSize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  };

  useEventListener("resize", handleSize);

  // Set size at the first client-side load
  useLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return windowSize;
}

type Handler = (event: MouseEvent) => void;

export function useClickAnyWhere(handler: Handler) {
  useEventListener("click", (event) => {
    handler(event);
  });
}
