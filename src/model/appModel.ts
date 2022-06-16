import type { Action, Thunk, ThunkOn } from "easy-peasy";
import { action, thunk, thunkOn } from "easy-peasy";
import _ from "lodash";

import CardData from "../data_structs/CardData";
import WidgetData from "../data_structs/WidgetData";
import { AppMode } from "../enums";
import type AppError from "../interfaces/AppError";
import type RawCardRow from "../interfaces/RawCardRow";
import appConfig from "../static/appConfig";
import widgets from "../static/widgets";
import type { StoreModel } from "./index";
/**
 * Core app model
 * Responsible for managing the pool of active cards in a layout, global app state like if the App's
 * resources are loaded,
 */

export interface AppDataModel {
  /**The active cards present in the currently displayed layout  */
  activeCards: CardData[];
  /**The widgets present in the currently displayed layout */
  activeWidgets: WidgetData[];
  /**Add a new AppError to appErrors */
  addAppError: Action<AppDataModel, AppError>;
  /**List of current App Errors */
  appErrors: AppError[];
  /**The current AppMode of the Application, "DISPLAY" or "EDIT"  @*/
  appMode: AppMode;
  /**The entire array of all available cards from the Cards spreadsheet */
  availableCards: CardData[];
  /**The entire list of available cards from the Widgets Spreadsheets */
  availableWidgets: WidgetData[];
  editingCard: CardData | undefined;
  /**True if all sheets were successfully loaded */
  isLoaded: boolean;
  /**Fires when the AppMode changes */
  manageViewModeChange: Thunk<AppDataModel, AppMode>;
  /**Fire on succesfully loading the Google Sheet for the cards */
  onCardSheetLoadSuccess: ThunkOn<AppDataModel, never, StoreModel>;
  /**Fires when a layout it selected*/
  onSetActiveLayout: ThunkOn<AppDataModel, never, StoreModel>;
  /**Fires when a card is released on top  of another card, taking it's place */
  onSwapCardContent: ThunkOn<AppDataModel, never, StoreModel>;
  /**Disable or enable the rotation of layouts. If false, then layouts will not rotate */
  rotateLayouts: boolean;
  /**Set the time between layout rotations */
  rotationSpeed: number;
  /**Set AppModel.ActiveCards */
  setActiveCards: Action<AppDataModel, CardData[]>;
  /**set AppModel.activeWidgets */
  setActiveWidgets: Action<AppDataModel, WidgetData[]>;
  /**set AppModel.appMode */
  setAppMode: Action<AppDataModel, AppMode>;
  /**set AppModel.availableCards*/
  setAvailableCards: Action<AppDataModel, CardData[]>;
  /**set AppModel.editingCard */
  setEditingCard: Action<AppDataModel, CardData | undefined>;
  /**set AppModel.rotateLayouts*/
  setRotateLayouts: Action<AppDataModel, boolean>;
  /**set the duration which each layout displays before showing the next layout */
  setRotationSpeed: Action<AppDataModel, number>;
  /**Switch the application mode between Edit and Display Mode */
  toggleAppMode: Thunk<AppDataModel, never>;
}

const availableWidgets = Object.values(widgets).map(
  (widgetInfo) => new WidgetData(widgetInfo)
);

const appModel: AppDataModel = {
  activeCards: [],
  activeWidgets: [],
  addAppError: action((state, error) => {
    const errorsString = state.appErrors.map(
      (error) => JSON.stringify(error) as string
    );
    const newError = JSON.stringify(error);
    if (!errorsString.includes(newError)) {
      state.appErrors.push(error);
    }
  }),
  appErrors: [],
  appMode: AppMode.DISPLAY,
  availableCards: [],
  availableWidgets: availableWidgets,
  editingCard: undefined,
  isLoaded: false,
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
  onCardSheetLoadSuccess: thunkOn(
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    async (actions, target, { getState }) => {
      target.payload.getSheetRows<RawCardRow>("CARDS").then((rows) => {
        const rawCardRowsArray = rows.map((row) => {
          return {
            added: row.added,
            author: row.author,
            interaction: row.interaction,
            sourceid: row.sourceid,
            src: row.src,
            title: row.title,
          } as RawCardRow;
        });
        const cards = getState().availableCards;
        for (const [index, row] of rawCardRowsArray.entries()) {
          if (
            !getState()
              .availableCards.map((c) => c.src)
              .includes(row.src)
          ) {
            cards.push(new CardData(row, index));
          }
        }
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
  rotateLayouts: true,
  rotationSpeed: appConfig.timers.rotationDuration,
  setActiveCards: action((state, cardDataArray) => {
    state.activeCards = cardDataArray;
  }),
  setActiveWidgets: action((state, widgetDataArray) => {
    state.activeWidgets = widgetDataArray;
  }),
  setAppMode: action((state, viewModeEnum) => {
    state.appMode = viewModeEnum;
  }),
  setAvailableCards: action((state, cardDataArray) => {
    state.availableCards = cardDataArray;
  }),
  setEditingCard: action((state, card) => {
    state.editingCard = card;
  }),
  setRotateLayouts: action((state, should) => {
    state.rotateLayouts = should;
  }),

  setRotationSpeed: action((state, speed) => {
    state.rotationSpeed = speed;
  }),

  toggleAppMode: thunk((actions, _, { getState }) => {
    switch (getState().appMode) {
      case AppMode.EDIT:
        actions.setEditingCard(undefined);
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
};

export default appModel;
