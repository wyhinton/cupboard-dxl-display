import {
  Action,
  action,
  computed,
  Computed,
  debug,
  Thunk,
  thunk,
  ThunkOn,
  thunkOn,
} from "easy-peasy";
import _ from "lodash";
import { Layout } from "react-grid-layout";

import CardData from "../data_structs/CardData";
import WidgetData, { WidgetType } from "../data_structs/WidgetData";
import { AppMode } from "../enums";
import AppError from "../interfaces/AppError";
import type RawCardRow from "../interfaces/RawCardRow";
import appConfig from "../static/appConfig";
import widgets from "../static/widgets";
// import defaultGridLayout from "../static/defaultStaticLayout";
import { StoreModel } from "./index";
/**
 * Core app model
 * @param
 */

export interface AppDataModel {
  //state
  isLoaded: boolean;
  availableCards: CardData[];
  availableWidgets: WidgetData[];
  activeWidgets: WidgetData[];
  // activeWidgets: Computed<AppDataModel, WidgetData[], StoreModel>;
  // activeWidgets: WidgetData[];
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

const availableWidgets = Object.values(widgets).map(
  (widgetInfo) => new WidgetData(widgetInfo)
);

const appModel: AppDataModel = {
  //state
  isLoaded: false,
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
    }
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
      console.log("DOING ON SET ACTIVE LAYOUT");
      console.log(layout.payload.layout);
      console.log(layout.payload.widgets());
      const { availableWidgets } = getState();
      // const availableIds = availableWidgets.map(w=>w)
      actions.setActiveWidgets(
        availableWidgets.filter((w) => layout.payload.widgets().includes(w.id))
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
      // actions.setActiveWidgets(availableWidgetsUpdated);
      actions.setActiveCards(activeCards);
      // actions.setActiveWidgets(activeWidgets);
    }
  ),

  onSwapCardContent: thunkOn(
    (actions, storeActions) => storeActions.layoutsModel.swapCardContent,
    async (actions, payload, { getState }) => {
      const newCards = getState().activeCards.map((c) => {
        if (c.sourceId === payload.payload.targetId) {
          const newSource = getState().availableCards.find(
            (c) => c.sourceId === payload.payload.sourceId
          );
          return newSource;
        } else {
          return c;
        }
      });
      if (newCards) {
        actions.setActiveCards(newCards as CardData[]);
      }
    }
  ),
};

export default appModel;
