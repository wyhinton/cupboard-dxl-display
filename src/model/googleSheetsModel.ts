import { action, Action, thunk, Thunk } from "easy-peasy";
import type GoogleSheet from "../interfaces/GoogleSheet";
import type RawCardRow from "../interfaces/RawCardRow";
import type RawLayoutRow from "../interfaces/RawLayoutRow";

import { getSheet } from "../utils";
import cardDataSheetKey from "../static/cardDataSheetKey";

type Result =
  | { success: true; value: unknown }
  | { success: false; error: Error };

export interface GoogleSheetsModel {
  //state
  cardDataGoogleSheet: GoogleSheet<RawCardRow> | null;
  layoutDataGoogleSheet: GoogleSheet<RawLayoutRow> | null;

  //requests
  fetchCardDataGoogleSheet: Thunk<GoogleSheetsModel>;
  fetchLayoutDataGoogleSheet: Thunk<GoogleSheetsModel>;

  //setters
  setCardDataGoogleSheet: Action<GoogleSheetsModel, GoogleSheet<RawCardRow>>;
  setLayoutDataGoogleSheet: Action<
    GoogleSheetsModel,
    GoogleSheet<RawLayoutRow>
  >;
}
/**
 * Responsible for making requestst to google sheets. Other models must listen this model to intercept the sheet payload.
 * Also stores the fetch data purely for debugging purposes.
 */

const googleSheetsModel: GoogleSheetsModel = {
  //state
  layoutDataGoogleSheet: null,
  cardDataGoogleSheet: null,
  //requests
  /**Handle a request to the google sheet containing the cards
   * listeners: appModel.onCardSheetLoadSuccess
   */
  fetchCardDataGoogleSheet: thunk(async (actions) => {
    getSheet<RawCardRow>(cardDataSheetKey).then((sheet) => {
      console.log(sheet);
      actions.setCardDataGoogleSheet(sheet);
    });
  }),
  /**Handle a request to the google sheet containing the layouts
   * listeners: layoutsModel.onLayoutSheetLoadSuccess
   */
  fetchLayoutDataGoogleSheet: thunk(async (actions) => {
    const tempCardLayout = {
      key: cardDataSheetKey.key,
      sheet_number: 2,
    };
    getSheet<RawLayoutRow>(tempCardLayout).then((sheet) => {
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
