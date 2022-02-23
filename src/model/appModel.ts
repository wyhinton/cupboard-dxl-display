import type { Action, Thunk, ThunkOn } from "easy-peasy";
import { action, thunk, thunkOn } from "easy-peasy";
import _ from "lodash";

import CardData from "../data_structs/CardData";
import WidgetData from "../data_structs/WidgetData";
import { AppMode } from "../enums";
import AppError from "../interfaces/AppError";
import type RawCardRow from "../interfaces/RawCardRow";
import appConfig from "../static/appConfig";
import widgets from "../static/widgets";
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
  activeCards: CardData[];
  rotationSpeed: number;
  rotateLayouts: boolean;
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
  // animationCounter: 0,
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
        undefined;
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
  // transitionLayout: thunk((actions, val, {getState}) => {

  //   actions.setAnimationCounter(getState().animationCounter+1)
  //   setTimeout(()=>{
  //     actions.set
  //   })
  // }),
  // setAnimationCounter: action((state, value) => {
  //   state.animationCounter += 1;
  // }),

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
    async (actions, target, { getState }) => {
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
        const cards = getState().availableCards;
        // const cards: CardData[] = [];
        rawCardRowsArray.forEach((row, index) => {
          if (
            !getState()
              .availableCards.map((c) => c.src)
              .includes(row.src)
          ) {
            cards.push(new CardData(row, index));
          }
        });
        actions.setAvailableCards(cards);
      });
    }
  ),
  onSetActiveLayout: thunkOn(
    (actions, storeActions) => storeActions.layoutsModel.setActiveLayout,
    async (actions, layout, { getState }) => {
      const activeSourceIds = new Set(layout.payload.sources());

      const { availableWidgets } = getState();
      actions.setActiveWidgets(
        availableWidgets.filter((w) => layout.payload.widgets().includes(w.id))
      );

      const availableCardsUpdated = getState().availableCards.map((card) => {
        if (activeSourceIds.has(card.id)) {
          card.setActive(true);
        } else {
          card.setActive(false);
        }
        return card;
      });
      const activeCards = getState().availableCards.filter((card) => {
        return activeSourceIds.has(card.id);
      });
      actions.setAvailableCards(availableCardsUpdated);
      actions.setActiveCards(activeCards);
    }
  ),

  onSwapCardContent: thunkOn(
    (actions, storeActions) => storeActions.layoutsModel.swapCardContent,
    async (actions, payload, { getState }) => {
      const newCards = getState().activeCards.map((c) => {
        return c.id === payload.payload.targetId
          ? getState().availableCards.find(
              (c) => c.id === payload.payload.sourceId
            )
          : c;
      });
      if (newCards) {
        actions.setActiveCards(newCards as CardData[]);
      }
    }
  ),
};

export default appModel;
