import {
  Action,
  action,
  debug,
  Thunk,
  thunk,
  ThunkOn,
  thunkOn,
} from "easy-peasy";
// import type {Action, Thunk, ThunkOn} from "easy-peasy/types"
import { Layouts } from "react-grid-layout";

import CardData from "../data_structs/CardData";
import WidgetData, { WidgetType } from "../data_structs/WidgetData";
import type { SheetNames } from "../enums";
import { AppMode } from "../enums";
import type RawCardRow from "../interfaces/RawCardRow";
import appConfig from "../static/appConfig";
import defaultGridLayout from "../static/defaultStaticLayout";
import { StoreModel } from "./index";
/**
 * Core app model
 * @param
 */
export interface AppDataModel {
  //state
  availableCards: CardData[];
  availableWidgets: WidgetData[];
  activeWidgets: WidgetData[];
  activeCards: CardData[];
  rotationSpeed: number;
  rotateLayouts: boolean;
  // currentLayout: Layouts;
  appMode: AppMode;

  //listeners
  onCardSheetLoadSuccess: ThunkOn<AppDataModel, never, StoreModel>;
  onSwapCardContent: ThunkOn<AppDataModel, never, StoreModel>;
  onSetActiveLayout: ThunkOn<AppDataModel, never, StoreModel>;
  //managers
  manageViewModeChange: Thunk<AppDataModel, AppMode>;
  toggleAppMode: Thunk<AppDataModel, never>;
  //simple setters
  setRotationSpeed: Action<AppDataModel, number>;
  setRotateLayouts: Action<AppDataModel, boolean>;
  setAppMode: Action<AppDataModel, AppMode>;
  // setCurrentLayout: Action<AppDataModel, Layouts>;
  setActiveCards: Action<AppDataModel, CardData[]>;
  setActiveWidgets: Action<AppDataModel, WidgetData[]>;
  setAvailableCards: Action<AppDataModel, CardData[]>;
  registerCardLoadFailure: Thunk<AppDataModel, CardData, never, StoreModel>;
}

const availableWidgets = appConfig.widgetIds.map(
  (n) => new WidgetData(n as WidgetType)
);

const appModel: AppDataModel = {
  //state
  availableCards: [],
  availableWidgets: availableWidgets,
  activeWidgets: [],
  activeCards: [],
  rotateLayouts: true,
  rotationSpeed: appConfig.rotationDuration,
  // currentLayout: defaultGridLayout.layout,
  appMode: AppMode.DISPLAY,
  // localStorageLayouts: [],

  //managers
  /**Control side effects for altering the view state of the app, and dispatch a setter for the state */
  manageViewModeChange: thunk((actions, viewModeEnum) => {
    // console.log(viewModeEnum);
    actions.setAppMode(viewModeEnum);
    switch (viewModeEnum) {
      case AppMode.EDIT:
        break;
      case AppMode.DISPLAY:
        break;
      case AppMode.CYCLE:
        break;
      default:
        console.log("reached default in set view mode thunk");
    }
  }),
  toggleAppMode: thunk((actions, _, { getState }) => {
    // console.log("toggling view mod ");

    switch (getState().appMode) {
      case AppMode.EDIT:
        actions.setAppMode(AppMode.DISPLAY);
        break;
      case AppMode.DISPLAY:
        actions.setAppMode(AppMode.EDIT);
        break;
      case AppMode.CYCLE:
        break;
      default:
        console.log("reached default in set view mode thunk");
    }
    console.log(getState().appMode);
  }),
  setAvailableCards: action((state, cardDataArray) => {
    // console.log("setting available cards");
    state.availableCards = cardDataArray;
  }),
  setActiveCards: action((state, cardDataArray) => {
    // console.log(cardDataArray);
    state.activeCards = cardDataArray;
  }),
  setActiveWidgets: action((state, widgetDataArray) => {
    // console.log(widgetDataArray);
    state.activeWidgets = widgetDataArray;
  }),
  setAppMode: action((state, viewModeEnum) => {
    // console.log("setting view mode");
    state.appMode = viewModeEnum;
  }),
  setRotationSpeed: action((state, speed) => {
    // console.log("setting view mode");
    state.rotationSpeed = speed;
  }),
  setRotateLayouts: action((state, should) => {
    // console.log("setting view mode");
    state.rotateLayouts = should;
  }),

  //listeners
  onCardSheetLoadSuccess: thunkOn(
    // targetResolver:
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    // handler:
    async (actions, target) => {
      console.log("TRIGGERD");
      // console.log("got on card sheet load success");
      console.log(target.payload);
      target.payload.getSheetRows<RawCardRow>("CARDS").then((rows) => {
        console.log(rows);
        const rawCardRowsArray = rows.map((row) => {
          return {
            src: row.src,
            title: row.title,
            added: row.added,
            sourceid: row.sourceid,
            author: row.author,
            interaction: row.interaction,
          } as RawCardRow;
        });

        const cards = rawCardRowsArray.map((c: RawCardRow) => new CardData(c));
        // console.log(cards);
        // actions.setActiveCards(cards)
        actions.setAvailableCards(cards);
      });
    }
  ),
  onSetActiveLayout: thunkOn(
    (actions, storeActions) => storeActions.layoutsModel.setActiveLayout,
    async (actions, layout, { getState }) => {
      // console.log(layout.);
      // console.log("SETTING ACTIVE LAYOUT");
      const activeSourceIds = new Set(layout.payload.sources());
      // console.log(layout.payload);
      // console.log(layout.payload.layoutWidgets);
      const activeWidgetIds = new Set(
        layout.payload.layoutWidgets.map((w) => w.id) ?? []
      );
      // console.log("ACTIVE WIDGET IDS", activeWidgetIds);

      const availableCardsUpdated = getState().availableCards.map((card) => {
        if (activeSourceIds.has(card.sourceId)) {
          card.setActive(true);
        } else {
          card.setActive(false);
        }
        return card;
      });
      const activeCards = getState().availableCards.filter((card) => {
        return activeSourceIds.has(card.sourceId);
      });
      // console.log(object);
      // availableWidgets = layout.payload.layout.
      const activeWidgets = availableWidgets.filter((card) => {
        return activeWidgetIds.has(card.id);
      });
      actions.setAvailableCards(availableCardsUpdated);
      actions.setActiveCards(activeCards);
      console.log(activeWidgets);
      actions.setActiveWidgets(activeWidgets);
    }
  ),
  registerCardLoadFailure: thunk(
    (actions, failedCard, { getState, getStoreState }) => {
      console.log("Got card Register Load Failure at Layouts Model");
      console.log(failedCard);
      const { activeCards } = getState();
      const failedId = failedCard.sourceId;
      const newCards = activeCards.map((c) => {
        if (c.sourceId === failedId) {
          console.log("found failed");
          c.fail();
        }
        return c;
      });
      actions.setActiveCards(newCards);
    }
  ),
  onSwapCardContent: thunkOn(
    (actions, storeActions) => storeActions.layoutsModel.swapCardContent,
    async (actions, payload, { getState }) => {
      console.log("got swap card content");
      console.log(payload.payload);
      console.log(getState().activeCards);
      const newCards = getState().activeCards.map((c) => {
        if (c.sourceId === payload.payload.targetId) {
          const newSource = getState().availableCards.find(
            (c) => c.sourceId === payload.payload.sourceId
          );
          console.log(newSource);
          return newSource;
        } else {
          return c;
        }
      });
      if (newCards) {
        actions.setActiveCards(newCards as CardData[]);
      }
      console.log(debug(payload));
    }
  ),
};

export default appModel;
