import {
  action,
  thunk,
  Thunk,
  Action,
  thunkOn,
  ThunkOn,
  debug,
} from "easy-peasy";
import GetSheetDone from "get-sheet-done";
import CardData from "../data_structs/cardData";
import type { GoogleSheet, RawCardInfoRow } from "../data_structs/google_sheet";
import { Layouts, Layout } from "react-grid-layout";
import defaultGridLayout from "../static/default_layout";
import { ViewMode } from "../enums";
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
  bufferLayout: Layouts;
  viewMode: ViewMode;
  history: History;
  localStorageLayouts: any[];

  //requests
  fetchGoogleSheet: Thunk<AppDataModel>;

  //loaders
  loadLocalLayouts: Action<AppDataModel>;

  //managers
  manageViewModeChange: Thunk<AppDataModel, ViewMode>;

  //simple setters
  setViewMode: Action<AppDataModel, ViewMode>;
  setCurrentLayout: Action<AppDataModel, Layouts>;
  setBufferLayout: Action<AppDataModel, Layouts>;
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
  bufferLayout: defaultGridLayout,
  viewMode: ViewMode.DISPLAY,
  history: new History(),
  localStorageLayouts: [],

  //requests
  fetchGoogleSheet: thunk(async (actions) => {
    getSheet<RawCardInfoRow>(
      "181P-SDszUOj_xn1HJ1DRrO8pG-LXyXNmINcznHeoK8k",
      1
    ).then((sheet) => {
      const cards = sheet.data.map((c) => new CardData(c));
      actions.setAvailableCards(cards);
      actions.setActiveCards(cards);
    });
  }),

  //managers
  manageViewModeChange: thunk((actions, viewModeEnum) => {
    console.log(viewModeEnum);
    actions.setViewMode(viewModeEnum);
    switch (viewModeEnum) {
      case ViewMode.EDIT:
        break;
      case ViewMode.DISPLAY:
        break;
      case ViewMode.CYCLE:
        break;
      default:
        console.log("reached default in set view mode thunk");
    }
  }),
  //adders
  // addEditHistory: action((state, layouts) => {
  //   state.history.addEvent(layouts);
  // }),
  //simple setters
  setCurrentLayout: action((state, layoutArr) => {
    state.currentLayout = layoutArr;
  }),
  setBufferLayout: action((state, layouts) => {
    state.bufferLayout = layouts;
  }),
  setAvailableCards: action((state, cardDataArr) => {
    state.availableCards = cardDataArr;
  }),
  setActiveCards: action((state, cardDataArr) => {
    console.log("setting cards");
    state.activeCards = cardDataArr;
  }),
  setViewMode: action((state, viewModeEnum) => {
    console.log("setting cards");
    state.viewMode = viewModeEnum;
  }),
  //listeners
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

function getSheet<T>(key: string, sheetNum: number): Promise<GoogleSheet<T>> {
  const promise = new Promise<GoogleSheet<T>>(function (resolve, reject) {
    GetSheetDone.labeledCols(key, sheetNum)
      .then((sheet: GoogleSheet<T>) => {
        console.log(sheet);
        resolve(sheet);
      })
      .catch((err: unknown) => {
        console.error(
          `Error: ${err} fetching DOC_KEY ${key}, sheet number ${sheetNum}`
        );
      });
  });
  return promise;
}

export default appData;
