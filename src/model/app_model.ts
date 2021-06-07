import { action, thunk, Thunk, Action } from "easy-peasy";
import GetSheetDone from "get-sheet-done";
import CardData from "./card_model";
import type { GoogleSheet, RawCardInfoRow } from "./google_sheet";
/**
 * Core app model
 * @param
 */
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

const appData: AppDataModel = {
  availableCards: [],
  activeCards: [],
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
  setAvailableCards: action((state, payload) => {
    state.availableCards = payload;
  }),
  setActiveCards: action((state, payload) => {
    state.activeCards = payload;
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
