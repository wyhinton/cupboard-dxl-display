import { action, Action, thunk, Thunk } from "easy-peasy";
import type GoogleSheet from "../interfaces/GoogleSheet";
import type RawCardRow from "../interfaces/RawCardRow";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import cardDataSheetKey from "../static/cardDataSheetKey";
import layoutsGoogleSheetKey from "../static/layoutsGoogleSheetKey";
import GoogleSheetData from "../data_structs/GoogleSheetData";
import Papa from "papaparse";
import { SheetNames } from "../enums";
import SheetId from "../interfaces/SheetId";

export interface GoogleSheetsModel {
  //state
  appGoogleSheet: GoogleSheetData | undefined;
  cardDataGoogleSheet: RawCardRow[] | null;
  layoutDataGoogleSheet: RawLayoutRow[]| null;
  //requests
  fetchAppGoogleSheet: Thunk<GoogleSheetsModel>;
  //setters
  setAppGoogleSheetData: Action<GoogleSheetsModel, GoogleSheetData>;
  setCardDataGoogleSheet: Action<GoogleSheetsModel, RawCardRow[]>;
  setLayoutDataGoogleSheet: Action<
    GoogleSheetsModel,
    RawLayoutRow[]
  >;
}
/**
 * Responsible for making requestst to google sheets. Other models must listen this model to intercept the sheet payload.
 * Also stores the fetch data purely for debugging purposes.
 */

 interface LoadSheetResult{
  rows: unknown[];
  sheetTitle: SheetNames;
}

const googleSheetsModel: GoogleSheetsModel = {
  //state
  layoutDataGoogleSheet: null,
  cardDataGoogleSheet: null,
  appGoogleSheet: undefined,
  //requests
  fetchAppGoogleSheet: thunk(async (actions) => {


  function parseData(sheetTitle: SheetNames, sheetId: SheetId): Promise<LoadSheetResult>{
      let data;
      const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId.key}/export?format=csv&gid=${sheetId.gid}`
      return new Promise<LoadSheetResult>( (resolve) => {
        Papa.parse(csvUrl, {
          download: true,
          header: true,
          delimiter: ',',
          dynamicTyping: true,
          complete: (results) => {
            data = results.data;
            resolve({rows: data, sheetTitle: sheetTitle});
          }
        });
      });
  }

  const getCardDataResponse = parseData(SheetNames.CARDS, cardDataSheetKey)
  const getLayoutDataResponse = parseData( SheetNames.LAYOUTS, layoutsGoogleSheetKey)

  Promise.allSettled([getCardDataResponse, getLayoutDataResponse]).then(results=>{
    
    const sheetData = new GoogleSheetData(
      "DSC App",
      cardDataSheetKey.key,
    ); 
    const goodValues: PromiseFulfilledResult<LoadSheetResult>[] = [];
    
    results.forEach((result, num) => {
      if (result.status == "fulfilled") {
        goodValues.push(result)
        sheetData.addSheet(result.value.sheetTitle, result.value.rows)
      }
      if (result.status == "rejected") {
        console.error("failed ")
      }
    });
    actions.setAppGoogleSheetData(sheetData)
    sheetData.getSheetRows(SheetNames.CARDS).then(r=>{
      actions.setCardDataGoogleSheet(r as RawCardRow[])
    })
    sheetData.getSheetRows(SheetNames.LAYOUTS).then(r=>{
      actions.setLayoutDataGoogleSheet(r as RawLayoutRow[])
    })
  })
  }),
  setAppGoogleSheetData: action((state, googleSheet) => {
    state.appGoogleSheet = googleSheet;
  }),
  setCardDataGoogleSheet: action((state, sheet) => {
    state.cardDataGoogleSheet = sheet;
  }),
  setLayoutDataGoogleSheet: action((state, sheet) => {
    state.layoutDataGoogleSheet = sheet;
  }),
};

export default googleSheetsModel;
