import { ActionCreator, createTypedHooks, ThunkCreator } from "easy-peasy";
import { StoreModel } from "./model";
import React, {
  EffectCallback,
  MouseEventHandler,
  RefObject,
  useEffect,
  useState,
} from "react";
import { AppMode } from "./enums";
import LayoutData from "./data_structs/LayoutData";
import CardData from "./data_structs/CardData";
import WidgetData from "./data_structs/WidgetData";
import { CardAddEvent, CardSwapEvent } from "./interfaces/CardEvents";

const typedHooks = createTypedHooks<StoreModel>();

// We export the hooks from our store as they will contain the
// type information on them
// see https://easy-peasy.vercel.app/docs/api/use-store-actions.html for more on store hooks
export const useStoreActions = typedHooks.useStoreActions;
export const useStoreDispatch = typedHooks.useStoreDispatch;
export const useStoreState = typedHooks.useStoreState;

export function useToggle(initialValue: boolean): [boolean, () => void] {
  const [value, setValue] = useState<boolean>(initialValue);

  const toggleValue = () => setValue(!value);

  return [value, toggleValue];
}

interface UseAppProps {
  appMode: AppMode;
  toggleAppMode: ThunkCreator<void, any>;
}
export const useApp = (): UseAppProps => {
  const toggleAppMode = useStoreActions(
    (actions) => actions.appModel.toggleAppMode
  );

  const appMode = useStoreState((state) => state.appModel.appMode);

  return {
    appMode,
    toggleAppMode,
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
  addWidget: ThunkCreator<CardAddEvent, any>;
  setActiveLayout: ActionCreator<LayoutData>;
}

export const useLayout = (): useLayoutProps => {
  const activeCards = useStoreState((state) => state.appModel.activeCards);
  const activeWidgets = useStoreState((state) => state.appModel.activeWidgets);

  const swapCard = useStoreActions(
    (actions) => actions.layoutsModel.swapCardContent
  );

  const addWidget = useStoreActions(
    (actions) => actions.layoutsModel.addWidget
  );

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

  const setActiveLayout = useStoreActions(
    (actions) => actions.layoutsModel.setActiveLayout
  );

  return {
    activeCards,
    activeWidgets,
    setBufferLayout,
    activeLayout,
    deleteCard,
    addCard,
    swapCard,
    addWidget,
    setActiveLayout,
  };
};
export const useKeyboardShortcut = ({
  keyCode,
  action,
  disabled,
}: {
  keyCode: number;
  action: (e: KeyboardEvent) => void;
  disabled: boolean;
}) => {
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
