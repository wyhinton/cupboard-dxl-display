import {
  Action,
  action,
  debug,
  Thunk,
  thunk,
  ThunkOn,
  thunkOn,
} from "easy-peasy";
import _ from "lodash";
// import type {Action, Thunk, ThunkOn} from "easy-peasy/types"

import CardData from "../data_structs/CardData";
import WidgetData, { WidgetType } from "../data_structs/WidgetData";
import type { SheetNames } from "../enums";
import { AppMode } from "../enums";
import AppError from "../interfaces/AppError";
import type RawCardRow from "../interfaces/RawCardRow";
import appConfig from "../static/appConfig";
// import defaultGridLayout from "../static/defaultStaticLayout";
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
  appErrors: AppError[];

  //listeners
  onCardSheetLoadSuccess: ThunkOn<AppDataModel, never, StoreModel>;
  onSwapCardContent: ThunkOn<AppDataModel, never, StoreModel>;
  onSetActiveLayout: ThunkOn<AppDataModel, never, StoreModel>;
  //managers
  manageViewModeChange: Thunk<AppDataModel, AppMode>;
  toggleAppMode: Thunk<AppDataModel, never>;
  //simple setters
  addAppError: Action<AppDataModel, AppError>;
  setRotationSpeed: Action<AppDataModel, number>;
  setRotateLayouts: Action<AppDataModel, boolean>;
  setAppMode: Action<AppDataModel, AppMode>;
  setActiveCards: Action<AppDataModel, CardData[]>;
  setActiveWidgets: Action<AppDataModel, WidgetData[]>;
  setAvailableCards: Action<AppDataModel, CardData[]>;
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
  appErrors: [],
  rotateLayouts: true,
  rotationSpeed: appConfig.rotationDuration,
  appMode: AppMode.DISPLAY,
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
    state.availableCards = cardDataArray;
  }),
  setActiveCards: action((state, cardDataArray) => {
    state.activeCards = cardDataArray;
  }),
  setActiveWidgets: action((state, widgetDataArray) => {
    state.activeWidgets = widgetDataArray;
  }),
  setAppMode: action((state, viewModeEnum) => {
    state.appMode = viewModeEnum;
  }),
  setRotationSpeed: action((state, speed) => {
    state.rotationSpeed = speed;
  }),
  setRotateLayouts: action((state, should) => {
    state.rotateLayouts = should;
  }),
  addAppError: action((state, error) => {
    const errorsString = state.appErrors.map(
      (error) => JSON.stringify(error) as string
    );
    const newError = JSON.stringify(error);
    // const errorBasic = error.
    if (!errorsString.includes(newError)) {
      state.appErrors.push(error);
    }
  }),

  //listeners
  onCardSheetLoadSuccess: thunkOn(
    // targetResolver:
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    // handler:
    async (actions, target) => {
      target.payload.getSheetRows<RawCardRow>("CARDS").then((rows) => {
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
        actions.setAvailableCards(cards);
      });
    }
  ),
  onSetActiveLayout: thunkOn(
    (actions, storeActions) => storeActions.layoutsModel.setActiveLayout,
    async (actions, layout, { getState }) => {
      const activeSourceIds = new Set(layout.payload.sources());
      const activeWidgetIds = new Set(
        layout.payload.layoutWidgets.map((w) => w.id) ?? []
      );

      const availableCardsUpdated = getState().availableCards.map((card) => {
        if (activeSourceIds.has(card.sourceId)) {
          card.setActive(true);
        } else {
          card.setActive(false);
        }
        return card;
      });

      const availableWidgetsUpdated = getState().availableWidgets.map(
        (widget) => {
          if (activeSourceIds.has(widget.id)) {
            widget.setActive(true);
          } else {
            widget.setActive(false);
          }
          return widget;
        }
      );

      const activeCards = getState().availableCards.filter((card) => {
        return activeSourceIds.has(card.sourceId);
      });
      const activeWidgets = availableWidgets.filter((card) => {
        return activeWidgetIds.has(card.id);
      });
      actions.setAvailableCards(availableCardsUpdated);
      actions.setActiveWidgets(availableWidgetsUpdated);
      actions.setActiveCards(activeCards);
      console.log(activeWidgets);
      actions.setActiveWidgets(activeWidgets);
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
  // getLayoutCards: action((state, layoutId)=>{
  //   return
  // })
};

export default appModel;
