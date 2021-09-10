import { action, Action, thunk, Thunk } from "easy-peasy";
import type GoogleSheet from "../interfaces/GoogleSheet";
import type RawCardRow from "../interfaces/RawCardRow";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import cardDataSheetKey from "../static/cardDataSheetKey";
import layoutsGoogleSheetKey from "../static/layoutsGoogleSheetKey";
import GoogleSheetData from "../data_structs/GoogleSheetData";
import Papa from "papaparse";
import { SheetNames } from "../enums";

type Result =
  | { success: true; value: unknown }
  | { success: false; error: Error };

export interface GoogleSheetsModel {
  //state
  appGoogleSheet: GoogleSheetData | undefined;
  cardDataGoogleSheet: RawCardRow[] | null;
  // cardDataGoogleSheet: GoogleSheet<RawCardRow> | null;
  layoutDataGoogleSheet: GoogleSheet<RawLayoutRow> | null;

  //requests
  fetchAppGoogleSheet: Thunk<GoogleSheetsModel>;
  // fetchLayoutDataGoogleSheet: Thunk<GoogleSheetsModel>;
  // completSheetLoad: Thunk<
  //setters
  setAppGoogleSheetData: Action<GoogleSheetsModel, GoogleSheetData>;
  setCardDataGoogleSheet: Action<GoogleSheetsModel, RawCardRow[]>;
  // setCardDataGoogleSheet: Action<GoogleSheetsModel, GoogleSheet<RawCardRow>>;
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
  appGoogleSheet: undefined,
  //requests
  /**Handle a request to the google sheet containing the cards
   * listeners: appModel.onCardSheetLoadSuccess
   */
  fetchAppGoogleSheet: thunk(async (actions) => {
  interface loadSheetResult{
    rows: unknown[];
    sheetTitle: SheetNames;
  }

  function parseData(url: string, sheetTitle: SheetNames): Promise<loadSheetResult>{
      let data;
      return new Promise<loadSheetResult>( (resolve) => {
        Papa.parse(url, {
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

  const getCardDataResponse = parseData("https://docs.google.com/spreadsheets/d/1o-R04VC8cIbcmqM68q4ESguaaNYb-0jhoPNgEuKa0i4/export?format=csv&gid=0", SheetNames.CARDS)
  const getLayoutDataResponse = parseData("https://docs.google.com/spreadsheets/d/1o-R04VC8cIbcmqM68q4ESguaaNYb-0jhoPNgEuKa0i4/export?format=csv&gid=1949477709", SheetNames.LAYOUTS)
  Promise.allSettled([getCardDataResponse, getLayoutDataResponse]).then(results=>{
    const sheetData = new GoogleSheetData(
      "DSC App",
      cardDataSheetKey.key,
  ); 
    const goodValues: PromiseFulfilledResult<loadSheetResult>[] = [];
    results.forEach((result, num) => {
      if (result.status == "fulfilled") {
        goodValues.push(result)
        sheetData.addSheet(result.value.sheetTitle, result.value.rows)
      }
      if (result.status == "rejected") {
        console.error("failed ")
      }
    });
    // return goodValues
    // Promise.resolve(sheets), 
    // sheets.forEach(sheet => {
    //     sheetData.addSheet(sheet.sheetTitle, sheet.rows)
    // });
    // console.log(sheetData)
    actions.setAppGoogleSheetData(sheetData)
  })
  // .then(s=>{
  //   const sheetData = new GoogleSheetData(
  //     "DSC App",
  //     cardDataSheetKey.key,
  // ); 
  //   s.forEach((result, num) => {
  //     sheetData.addSheet(result.value.sheetTitle, result.value.rows)
  //   })
  //   console.log(sheetData);
  //       actions.setAppGoogleSheetData(sheetData);
  // })
//   getCardDataResponse.then(d=>{
//       sheetData.addSheet("Cards", d)
//   })
//   getLayoutDataResponse.then(d=>{
//     console.log(d);
//     sheetData.addSheet("Layouts", d)
// })
  
//  Promise.all([getCar])
    // GoogleSheetData.prototype
    //   .loadSheets(
    //     cardDataSheetKey.key,
    //     process.env.REACT_APP_GCP_TOKEN as string
    //   )
    //   .then((response) => {
    //     Promise.all(response).then((responseData) => {
    //       const studentsGoogleSheet = new GoogleSheetData(
    //         "DSC App",
    //         cardDataSheetKey.key,
    //         responseData
    //       );
    //       actions.setAppGoogleSheetData(studentsGoogleSheet);
    //     });
    //   });
  }),
  setAppGoogleSheetData: action((state, googleSheet) => {
    state.appGoogleSheet = googleSheet;
  }),
  /**Handle a request to the google sheet containing the layouts
   * listeners: layoutsModel.onLayoutSheetLoadSuccess
   */
  // fetchLayoutDataGoogleSheet: thunk(async (actions) => {
  //   // getSheet<RawLayoutRow>(layoutsGoogleSheetKey).then((sheet) => {
  //   //   console.log(sheet);
  //   //   actions.setLayoutDataGoogleSheet(sheet);
  //   // });
  // }),
  //setters
  setCardDataGoogleSheet: action((state, sheet) => {
    state.cardDataGoogleSheet = sheet;
  }),
  setLayoutDataGoogleSheet: action((state, sheet) => {
    state.layoutDataGoogleSheet = sheet;
  }),
};

export default googleSheetsModel;
