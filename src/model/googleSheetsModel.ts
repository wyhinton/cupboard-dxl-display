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
import { RawTopSheetRow } from "../interfaces/RawTopSheetrow";

export interface GoogleSheetsModel {
  //state
  appGoogleSheet: GoogleSheetData | undefined;
  cardDataGoogleSheet: RawCardRow[] | null;
  layoutDataGoogleSheet: RawLayoutRow[]| null;
  formUrl: string|undefined;
  layoutSheetUrl: string|undefined;
  cardSheetUrl: string|undefined;
  //requests
  fetchTopLevelSheet: Thunk<GoogleSheetsModel>;
  fetchAppGoogleSheet: Thunk<GoogleSheetsModel>;
  fetchSheet: Thunk<GoogleSheetsModel, {url: string, name: SheetNames}[]>;
  //setters
  setFormUrl: Action<GoogleSheetsModel, string>;
  setCardSheetUrl: Action<GoogleSheetsModel, string>;
  setLayoutsSheetUrl: Action<GoogleSheetsModel, string>;
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
  formUrl: undefined,
  layoutSheetUrl: undefined,
  cardSheetUrl: undefined,
  //requests
  fetchTopLevelSheet: thunk((actions)=>{
    getData("TOP_LEVEL", process.env.REACT_APP_SHEET_URL as string).then(r=>{
      console.log(r);
      let sheetRow = r.rows[0] as RawTopSheetRow
      actions.setFormUrl(sheetRow.googleForm)
      actions.setLayoutsSheetUrl(urlToCsvUrl(sheetRow.layoutsSheet))
      actions.setCardSheetUrl(urlToCsvUrl(sheetRow.cardsSheet))
      // actions.fetchSheet({name: "CARDS", url: urlToCsvUrl(sheetRow.cardsSheet)})
      // actions.fetchSheet({name: "LAYOUTS", url: urlToCsvUrl(sheetRow.layoutsSheet)})
      actions.fetchSheet([{name: "LAYOUTS", url: urlToCsvUrl(sheetRow.layoutsSheet)}, {name: "CARDS", url: urlToCsvUrl(sheetRow.cardsSheet)}])
      // actions.fetchAppGoogleSheet()
    })
    console.log("GOT HERE");
  }),
  fetchSheet: thunk(async (actions, sheets, {getState}) => {
    // const getLayoutDataResponse = parseData( "LAYOUTS", layoutsGoogleSheetKey)
  
      console.log(getState().cardSheetUrl, getState().layoutSheetUrl);
    // const getCardDataResponse = getData("CARDS", getState().cardSheetUrl as string)
    // const getLayoutDataResponse = getData( "LAYOUTS", getState().layoutSheetUrl as string)
    const sheetResponses = sheets.map(s=>getData(s.name, s.url))
    // Promise.allSettled([getCardDataResponse, getLayoutDataResponse]).then(results=>{
      Promise.allSettled(sheetResponses).then(results=>{
      const sheetData = new GoogleSheetData(
        "DSC App",
        cardDataSheetKey.key,
      ); 
      const goodValues: PromiseFulfilledResult<LoadSheetResult>[] = [];
  
      results.forEach((result, num) => {
        console.log(result);
        if (result.status == "fulfilled") {
          goodValues.push(result)
          sheetData.addSheet(result.value.sheetTitle, result.value.rows)
        }
        if (result.status == "rejected") {
          console.error("failed ")
        }
      });
      actions.setAppGoogleSheetData(sheetData)
      sheetData.getSheetRows("CARDS").then(r=>{
        actions.setCardDataGoogleSheet(r as RawCardRow[])
      })
      sheetData.getSheetRows("LAYOUTS").then(r=>{
        actions.setLayoutDataGoogleSheet(r as RawLayoutRow[])
      })
    })
    }),
  
  fetchAppGoogleSheet: thunk(async (actions, _, {getState}) => {

  // const getCardDataResponse = parseData("CARDS", cardDataSheetKey)
  // const getLayoutDataResponse = parseData( "LAYOUTS", layoutsGoogleSheetKey)

    console.log(getState().cardSheetUrl, getState().layoutSheetUrl);
  const getCardDataResponse = getData("CARDS", getState().cardSheetUrl as string)
  const getLayoutDataResponse = getData( "LAYOUTS", getState().layoutSheetUrl as string)

  Promise.allSettled([getCardDataResponse, getLayoutDataResponse]).then(results=>{
    
    const sheetData = new GoogleSheetData(
      "DSC App",
      cardDataSheetKey.key,
    ); 
    const goodValues: PromiseFulfilledResult<LoadSheetResult>[] = [];

    results.forEach((result, num) => {
      console.log(result);
      if (result.status == "fulfilled") {
        goodValues.push(result)
        sheetData.addSheet(result.value.sheetTitle, result.value.rows)
      }
      if (result.status == "rejected") {
        console.error("failed ")
      }
    });
    actions.setAppGoogleSheetData(sheetData)
    sheetData.getSheetRows("CARDS").then(r=>{
      actions.setCardDataGoogleSheet(r as RawCardRow[])
    })
    sheetData.getSheetRows("LAYOUTS").then(r=>{
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
  setFormUrl: action((state, formUrl) => {
    state.formUrl = formUrl;
  }),
  setCardSheetUrl: action((state, cardSheetUrl) => {
    state.formUrl = cardSheetUrl;
  }),
  setLayoutsSheetUrl: action((state, layoutSheetUrl) => {
    state.formUrl = layoutSheetUrl;
  }),

};

export default googleSheetsModel;

function urlToCsvUrl(url: string){
  console.log(url);
  // https://docs.google.com/spreadsheets/d/1zwPZV75EhBLseFpcpQhHXEjLTV6JDrwfIGNhaI2GCXI/edit#gid=1913514186
  let sections = url.split("/")
  const sheetKey = sections[5]
  let sectionsGid = url.split("gid=")
  const gid = sectionsGid[1]
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetKey}/export?format=csv&gid=${gid}`
  return csvUrl
}


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
// https://docs.google.com/spreadsheets/d/e/2PACX-1vRalMG47cvXmCbEqeIJWn5qwd9bPhHUV16_VN7LuKsv5

function getData(sheetTitle: SheetNames, sheetUrl: string): Promise<LoadSheetResult>{
  let data;
  return new Promise<LoadSheetResult>( (resolve) => {
    Papa.parse(sheetUrl, {
      download: true,
      header: true,
      delimiter: ',',
      dynamicTyping: true,
      complete: (results) => {
        data = results.data;
        console.log(data);
        resolve({rows: data, sheetTitle: sheetTitle});
      }
    });
  });
}