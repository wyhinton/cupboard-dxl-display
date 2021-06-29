import { action, Action, thunk, Thunk, thunkOn, ThunkOn } from "easy-peasy";
import {
  GoogleSheet,
  RawCardInfoRow,
  RawLayoutRow,
} from "../data_structs/google_sheet";
import { getSheet } from "../utils";
import cardDataSheetKey from "../static/cardDataSheetKey";

type Result =
  | { success: true; value: unknown }
  | { success: false; error: Error };

export interface GoogleSheetsModel {
  //state
  cardDataGoogleSheet: GoogleSheet<RawCardInfoRow> | null;
  layoutDataGoogleSheet: GoogleSheet<RawLayoutRow> | null;
  //requests
  fetchCardDataGoogleSheet: Thunk<GoogleSheetsModel>;
  fetchLayoutDataGoogleSheet: Thunk<GoogleSheetsModel>;
  //setters
  setCardDataGoogleSheet: Action<
    GoogleSheetsModel,
    GoogleSheet<RawCardInfoRow>
  >;
  setLayoutDataGoogleSheet: Action<
    GoogleSheetsModel,
    GoogleSheet<RawLayoutRow>
  >;
}

const googleSheetsModel: GoogleSheetsModel = {
  //state
  layoutDataGoogleSheet: null,
  cardDataGoogleSheet: null,
  //requests
  fetchCardDataGoogleSheet: thunk(async (actions, _, { getState }) => {
    getSheet<RawCardInfoRow>(cardDataSheetKey, 1).then((sheet) => {
      console.log(sheet);
      actions.setCardDataGoogleSheet(sheet);
    });
  }),
  fetchLayoutDataGoogleSheet: thunk(async (actions, _, { getState }) => {
    getSheet<RawLayoutRow>(cardDataSheetKey, 2).then((sheet) => {
      console.log(sheet);
      actions.setLayoutDataGoogleSheet(sheet);
    });
  }),
  //setters
  setCardDataGoogleSheet: action((state, sheet) => {
    state.cardDataGoogleSheet = sheet;
  }),
  setLayoutDataGoogleSheet: action((state, sheet) => {
    state.layoutDataGoogleSheet = sheet;
  }),
};

export default googleSheetsModel;
