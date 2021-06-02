import { action, thunk, Thunk, Action } from "easy-peasy";
import GetSheetDone from "get-sheet-done";
import type { CardData } from "./card_model";

export interface AppDataModel {
  //state
  availableCards: CardData[];
  activeCards: CardData[];
  //requests
  fetchGoogleSheet: Thunk<AppDataModel>;
  //setters
  setActiveCards: Action<AppDataModel, CardData[]>;
  setAvailableCards: Action<AppDataModel, CardData[]>;
}
export interface GoolgeSheet<T> {
  data: Array<T>;
  title: string;
  updated: string;
}

const appData: AppDataModel = {
  //state
  availableCards: [],
  activeCards: [],
  //requests
  fetchGoogleSheet: thunk(async (actions) => {
    getSheet<CardData>("181P-SDszUOj_xn1HJ1DRrO8pG-LXyXNmINcznHeoK8k", 1).then(
      (values) => {
        actions.setAvailableCards(values.data as CardData[]);
        actions.setActiveCards(values.data as CardData[]);
      }
    );
  }),
  //setters
  setAvailableCards: action((state, payload) => {
    state.availableCards = payload;
  }),
  setActiveCards: action((state, payload) => {
    state.activeCards = payload;
  }),
};

function getSheet<T>(key: string, sheetNum: number): Promise<GoolgeSheet<T>> {
  const promise = new Promise<GoolgeSheet<T>>(function (resolve, reject) {
    GetSheetDone.labeledCols(key, sheetNum)
      .then((sheet: GoolgeSheet<T>) => {
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
