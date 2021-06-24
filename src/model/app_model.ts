import {
  action,
  thunk,
  Thunk,
  Action,
  thunkOn,
  ThunkOn,
  debug,
} from "easy-peasy";
import { getSheet } from "../utils";
import CardData from "../data_structs/cardData";
import LayoutData from "../data_structs/layout_data";
import type {
  RawCardInfoRow,
  RawLayoutRow,
} from "../data_structs/google_sheet";
import { Layouts, Layout } from "react-grid-layout";
import defaultGridLayout from "../static/default_layout";
import { AppMode } from "../enums";
import History from "../data_structs/history";
import { StoreModel } from "./index";
/**
 * Core app model
 * @param
 */
export interface AppDataModel {
  //state
  availableCards: CardData[];
  activeCards: CardData[];
  currentLayout: Layouts;
  appMode: AppMode;
  history: History;
  localStorageLayouts: any[];
  //requests
  fetchGoogleSheet: Thunk<AppDataModel>;

  //loaders
  loadLocalLayouts: Action<AppDataModel>;

  //listeners
  onSwapCardContent: ThunkOn<AppDataModel, never, StoreModel>;
  //managers
  manageViewModeChange: Thunk<AppDataModel, AppMode>;

  //simple setters
  setAppMode: Action<AppDataModel, AppMode>;
  setCurrentLayout: Action<AppDataModel, Layouts>;
  setActiveCards: Action<AppDataModel, CardData[]>;
  setAvailableCards: Action<AppDataModel, CardData[]>;
  //listeners
  onUndoHistory: ThunkOn<AppDataModel, never, StoreModel>;
  onRedoHistory: ThunkOn<AppDataModel, never, StoreModel>;

  //clear
  clearLocalLayouts: Action<AppDataModel>;

  //local storage
  saveLayoutLocal: Thunk<AppDataModel>;
}

const appData: AppDataModel = {
  //state
  availableCards: [],
  activeCards: [],
  currentLayout: defaultGridLayout,
  appMode: AppMode.DISPLAY,
  history: new History(),
  localStorageLayouts: [],

  //requests
  fetchGoogleSheet: thunk(async (actions, _, { getState }) => {
    getSheet<RawCardInfoRow>(
      "181P-SDszUOj_xn1HJ1DRrO8pG-LXyXNmINcznHeoK8k",
      1
    ).then((sheet) => {
      const cards = sheet.data.map((c) => new CardData(c));
      console.log(cards);
      actions.setAvailableCards(cards);
      const startCards = cards;
      console.log(startCards);
      actions.setActiveCards(startCards);
    });
  }),

  //managers
  manageViewModeChange: thunk((actions, viewModeEnum) => {
    console.log(viewModeEnum);
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
  setCurrentLayout: action((state, layoutArr) => {
    state.currentLayout = layoutArr;
  }),
  setAvailableCards: action((state, cardDataArr) => {
    console.log("setting available cards");
    state.availableCards = cardDataArr;
  }),
  setActiveCards: action((state, cardDataArr) => {
    console.log("setting active cards");
    state.activeCards = cardDataArr;
  }),
  setAppMode: action((state, viewModeEnum) => {
    console.log("setting view mode");
    state.appMode = viewModeEnum;
  }),

  //listeners
  onSwapCardContent: thunkOn(
    (actions, storeActions) => storeActions.layoutsData.swapCardContent,
    async (actions, payload, { getState }) => {
      console.log("got swap card content");
      console.log(payload.payload);
      console.log(getState().activeCards);
      const newCards = getState().activeCards.map((c) => {
        if (c.sourceId === payload.payload.targetId) {
          const newSource = getState().availableCards.filter(
            (c) => c.sourceId === payload.payload.sourceId
          )[0];
          console.log(newSource);
          return newSource;
        } else {
          return c;
        }
      });
      actions.setActiveCards(newCards);
      console.log(debug(payload));
    }
  ),
  onUndoHistory: thunkOn(
    (actions, storeActions) => storeActions.historyData.setCurrentHistory,
    async (actions, payload, { injections }) => {
      console.log("got undo");
      console.log(payload.payload);
      actions.setCurrentLayout(payload.payload);
      console.log(debug(payload));
    }
  ),
  onRedoHistory: thunkOn(
    (actions, storeActions) => storeActions.historyData.setCurrentHistory,
    async (actions, payload, { injections }) => {
      console.log("got redo");
      console.log(payload.payload);
      actions.setCurrentLayout(payload.payload);
      console.log(debug(payload));
    }
  ),
  //local storage
  clearLocalLayouts: action((state) => {
    localStorage.clear();
    state.localStorageLayouts = [];
  }),
  loadLocalLayouts: action((state) => {
    const layouts: any = Object.keys(localStorage)
      .filter((k) => k.startsWith("curLayout"))
      .map((k) => ({
        name: k,
        layout: JSON.parse(localStorage[k]) as Layout[],
      }));
    state.localStorageLayouts = layouts;
  }),
  saveLayoutLocal: thunk((actions, _, { getState }) => {
    localStorage.setItem(
      `curLayout_${localStorage.length}`,
      JSON.stringify(getState().currentLayout)
    );
    actions.loadLocalLayouts();
  }),
};

export default appData;
