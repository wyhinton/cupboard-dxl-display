import { ActionCreator, createTypedHooks, ThunkCreator } from "easy-peasy";
import { StoreModel } from "./model";
import React, {
  EffectCallback,
  MouseEventHandler,
  RefObject,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { AppMode } from "./enums";
import LayoutData from "./data_structs/LayoutData";
import CardData from "./data_structs/CardData";
import WidgetData from "./data_structs/WidgetData";
import { CardAddEvent, CardSwapEvent } from "./interfaces/CardEvents";
import AppError from "./interfaces/AppError";
import { GoogleSheetsModel } from "./model/googleSheetsModel";

const appModelHooks = createTypedHooks<StoreModel>();

export const useStoreActions = appModelHooks.useStoreActions;
export const useStoreDispatch = appModelHooks.useStoreDispatch;
export const useStoreState = appModelHooks.useStoreState;

export function useToggle(initialValue: boolean): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggleValue = () => setValue(!value);

  return [value, toggleValue];
}

interface UseSheetsProps {
  fetchTopLevelSheet: ThunkCreator<void, any>;

  parentSheetUrl: string | undefined;
  cardSheetUrl: string | undefined;
  layoutSheetUrl: string | undefined;
  formUrl: string | undefined;
}

export const useSheets = (): UseSheetsProps => {
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

interface UseErrorProps {
  appErrors: AppError[];
  layoutErrors: AppError[];
  googleSheetsErrors: AppError[];
  allErrors: AppError[];
}

export const useErrors = (): UseErrorProps => {
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
}

export const useApp = (): UseAppProperties => {
  const toggleAppMode = useStoreActions(
    (actions) => actions.appModel.toggleAppMode
  );

  const rotationSpeed = useStoreState((state) => state.appModel.rotationSpeed);
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
  const appMode = useStoreState((state) => state.appModel.appMode);

  return {
    appMode,
    rotationSpeed,
    setRotationSpeed,
    toggleAppMode,
    rotateLayouts,
    setRotateLayouts,
    addAppError,
    sheetsAreLoaded,
    transitionLayout,
    // animationCounter,
  };
};

interface useLayoutProps {
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

export const useLayout = (): useLayoutProps => {
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
  ref: RefObject<T>,
  handler: (event: AnyEvent) => void
): void {
  useEffect(() => {
    const listener = (event: AnyEvent) => {
      const el = ref?.current;

      // Do nothing if clicking ref's element or descendent elements
      if (!el || el.contains(event.target as Node)) {
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
  }, [ref, handler]);
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
  const timeOutRef = useRef<NodeJS.Timeout>();

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
    timeOutRef.current = id;
    return () => clearTimeout(id);
  }, [delay]);

  const reset = useCallback(() => {
    if (timeOutRef.current && delay) {
      clearTimeout(timeOutRef.current);
      timeOutRef.current = setTimeout(savedCallback.current, delay);
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (timeOutRef.current) {
      clearTimeout(timeOutRef.current);
    }
  }, []);

  return { reset, stop };
}
export function useInterval(
  callback: () => void,
  delay: number | null
): { reset: () => void; stop: () => void } {
  const savedCallback = useRef(callback);
  const intervalRef = useRef<NodeJS.Timeout>();

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
    intervalRef.current = id;
    return () => clearInterval(id);
  }, [delay]);

  const reset = useCallback(() => {
    if (intervalRef.current && delay) {
      clearInterval(intervalRef.current);
      intervalRef.current = setInterval(savedCallback.current, delay);
    }
  }, [delay]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
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
  const [ref, setRef] = useState<T | null>(null);
  const [size, setSize] = useState<Size>({
    width: 0,
    height: 0,
  });

  // Prevent too many rendering using useCallback
  const handleSize = useCallback(() => {
    setSize({
      width: ref?.offsetWidth || 0,
      height: ref?.offsetHeight || 0,
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  useEventListener("resize", handleSize);

  useLayoutEffect(() => {
    handleSize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref?.offsetHeight, ref?.offsetWidth]);

  return [setRef, size];
}

export function useHover<T extends HTMLElement = HTMLElement>(
  elementRef: RefObject<T>
): boolean {
  const [value, setValue] = useState<boolean>(false);

  const handleMouseEnter = () => setValue(true);
  const handleMouseLeave = () => setValue(false);

  useEventListener("mouseenter", handleMouseEnter, elementRef);
  useEventListener("mouseleave", handleMouseLeave, elementRef);

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
