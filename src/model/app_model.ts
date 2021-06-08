import { action, thunk, Thunk, Action } from "easy-peasy";
import GetSheetDone from "get-sheet-done";
import CardData from "./card_model";
import type { GoogleSheet, RawCardInfoRow } from "./google_sheet";
import { Layouts, Layout } from "react-grid-layout";
import defaultGridLayout from "../static/default_layout";
import { ViewMode } from "./enums";
/**
 * Core app model
 * @param
 */
export interface AppDataModel {
  //state
  availableCards: CardData[];
  activeCards: CardData[];
  currentLayout: Layout[];
  viewMode: ViewMode;
  //requests

  fetchGoogleSheet: Thunk<AppDataModel>;
  //setters
  setViewMode: Action<AppDataModel, ViewMode>;
  setCurrentLayout: Action<AppDataModel, Layout[]>;
  setActiveCards: Action<AppDataModel, CardData[]>;
  setAvailableCards: Action<AppDataModel, CardData[]>;
}

const appData: AppDataModel = {
  //state
  availableCards: [],
  activeCards: [],
  currentLayout: defaultGridLayout,
  viewMode: ViewMode.DEFAULT,
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

  //setters
  setViewMode: action((state, viewModeEnum) => {
    console.log(viewModeEnum);
    state.viewMode = viewModeEnum;
  }),
  setCurrentLayout: action((state, layoutArr) => {
    state.currentLayout = layoutArr;
  }),
  setAvailableCards: action((state, cardDataArr) => {
    state.availableCards = cardDataArr;
  }),
  setActiveCards: action((state, cardDataArr) => {
    console.log("setting cards");
    state.activeCards = cardDataArr;
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
