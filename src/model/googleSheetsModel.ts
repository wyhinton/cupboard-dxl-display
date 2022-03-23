import type { Action, Computed, Thunk } from "easy-peasy";
import { action, computed, thunk } from "easy-peasy";
import Papa from "papaparse";
import { act } from "react-dom/test-utils";

import GoogleSheetData from "../data_structs/GoogleSheetData";
import type { SheetNames } from "../enums";
import type AppError from "../interfaces/AppError";
import type PrincipleSheetRow from "../interfaces/PrincipleSheetRow";
import type RawCardRow from "../interfaces/RawCardRow";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import cardDataSheetKey from "../static/cardDataSheetKey";

/**
 * Responsible for making requests to google sheets. Other models must listen this model to intercept the sheet payload.
 * Also stores the fetch data purely for debugging purposes.
 */

export interface GoogleSheetsModel {
  //state
  parentGoogleSheet: GoogleSheetData | undefined;
  cardDataGoogleSheet: RawCardRow[] | null;
  layoutDataGoogleSheet: RawLayoutRow[] | null;

  formUrl: string | undefined;
  parentSheetUrl: string | undefined;
  layoutSheetUrl: string | undefined;
  cardSheetUrl: string | undefined;
  googleSheetsErrors: AppError[];
  urlSheet: string | null;

  //computed
  sheetsAreLoaded: Computed<GoogleSheetsModel, boolean>;
  //requests
  fetchTopLevelSheet: Thunk<GoogleSheetsModel>;
  fetchAppGoogleSheet: Thunk<GoogleSheetsModel>;
  fetchSheet: Thunk<GoogleSheetsModel, { url: string; name: SheetNames }[]>;
  //setters
  setFormUrl: Action<GoogleSheetsModel, string>;
  setParentSheetUrl: Action<GoogleSheetsModel, string>;
  setCardSheetUrl: Action<GoogleSheetsModel, string>;
  setLayoutsSheetUrl: Action<GoogleSheetsModel, string>;
  setAppGoogleSheetData: Action<GoogleSheetsModel, GoogleSheetData>;
  setCardDataGoogleSheet: Action<GoogleSheetsModel, RawCardRow[]>;
  setLayoutDataGoogleSheet: Action<GoogleSheetsModel, RawLayoutRow[]>;
  addGoogleSheetError: Action<GoogleSheetsModel, AppError>;
  setUrlSheet: Action<GoogleSheetsModel, string | null>;
}

interface LoadSheetResult {
  rows: unknown[];
  sheetTitle: SheetNames;
}

const googleSheetsModel: GoogleSheetsModel = {
  //sheets
  layoutDataGoogleSheet: null,
  cardDataGoogleSheet: null,
  parentGoogleSheet: undefined,
  urlSheet: null,
  //sheet urls
  parentSheetUrl: undefined,
  formUrl: undefined,
  layoutSheetUrl: undefined,
  cardSheetUrl: undefined,
  //other state
  googleSheetsErrors: [],
  sheetsAreLoaded: computed(
    [
      (state) => [
        state.layoutDataGoogleSheet,
        state.cardDataGoogleSheet,
        state.parentGoogleSheet,
      ],
    ],
    (sheets) => {
      return sheets.every((s) => s !== null);
    }
  ),
  fetchTopLevelSheet: thunk((actions) => {
    try {
      getSheetData("TOP_LEVEL", process.env.REACT_APP_SHEET_URL as string)
        .then((r) => {
          const sheetRow = r.rows[0] as PrincipleSheetRow;
          actions.setFormUrl(sheetRow.googleForm);
          actions.setLayoutsSheetUrl(sheetRow.layoutsSheet);
          actions.setCardSheetUrl(sheetRow.cardsSheet);
          actions.setParentSheetUrl(process.env.REACT_APP_SHEET_URL as string);
          actions.fetchSheet([
            {
              name: "LAYOUTS",
              url: googleSheetUrlToCSVUrl(sheetRow.layoutsSheet),
            },
            {
              name: "CARDS",
              url: googleSheetUrlToCSVUrl(sheetRow.cardsSheet),
            },
          ]);
        })
        .catch((error: unknown) => {
          actions.setLayoutsSheetUrl(
            googleSheetUrlToCSVUrl(
              `${process.env.PUBLIC_URL}/LAYOUTS_BACKUP.csv`
            )
          );
          actions.setCardSheetUrl(
            googleSheetUrlToCSVUrl(`${process.env.PUBLIC_URL}/CARDS_BACKUP.csv`)
          );
          actions.fetchSheet([
            {
              name: "LAYOUTS",
              url: `${process.env.PUBLIC_URL}/LAYOUTS_BACKUP.csv`,
            },
            {
              name: "CARDS",
              url: `${process.env.PUBLIC_URL}/CARDS_BACKUP.csv`,
            },
          ]);
        });
    } catch {
      console.log("DOING BACKUP");
      actions.addGoogleSheetError({
        errorType: "failed to fetch master google sheet",
        description:
          "failed to get the mater google sheet, reverting to local svg",
        source: process.env.REACT_APP_SHEET_URL ?? "NA",
        link: process.env.REACT_APP_SHEET_URL ?? "NA",
      });
    }
  }),
  fetchSheet: thunk(async (actions, sheets, { getState }) => {
    console.log(getState().cardSheetUrl, getState().layoutSheetUrl);
    const sheetResponses = sheets.map((s) => getSheetData(s.name, s.url));
    Promise.allSettled(sheetResponses).then((results) => {
      const sheetData = new GoogleSheetData("DSC App", cardDataSheetKey.key);
      const goodValues: PromiseFulfilledResult<LoadSheetResult>[] = [];

      for (const [number, result] of results.entries()) {
        console.log(result);
        if (result.status == "fulfilled") {
          goodValues.push(result);
          sheetData.addSheet(result.value.sheetTitle, result.value.rows);
        }
        if (result.status == "rejected") {
          console.error("failed ");
        }
      }
      actions.setAppGoogleSheetData(sheetData);
      sheetData.getSheetRows("CARDS").then((r) => {
        actions.setCardDataGoogleSheet(r as RawCardRow[]);
      });
      sheetData.getSheetRows("LAYOUTS").then((r) => {
        actions.setLayoutDataGoogleSheet(r as RawLayoutRow[]);
      });
    });
  }),

  fetchAppGoogleSheet: thunk(async (actions, _, { getState }) => {
    const getCardDataResponse = getSheetData(
      "CARDS",
      getState().cardSheetUrl as string
    );
    const getLayoutDataResponse = getSheetData(
      "LAYOUTS",
      getState().layoutSheetUrl as string
    );

    Promise.allSettled([getCardDataResponse, getLayoutDataResponse]).then(
      (results) => {
        const sheetData = new GoogleSheetData("DSC App", cardDataSheetKey.key);
        const goodValues: PromiseFulfilledResult<LoadSheetResult>[] = [];

        for (const [number, result] of results.entries()) {
          console.log(result);
          if (result.status == "fulfilled") {
            goodValues.push(result);
            sheetData.addSheet(result.value.sheetTitle, result.value.rows);
          }
          if (result.status == "rejected") {
            actions.addGoogleSheetError({
              errorType: "failed to fetch layout or card sheet",
              description: "could not retrieve google sheet",
              source: "LAYOUTS/CARD",
              link: "NA",
            });
            console.error("failed ");
          }
        }
        actions.setAppGoogleSheetData(sheetData);
        sheetData.getSheetRows("CARDS").then((r) => {
          actions.setCardDataGoogleSheet(r as RawCardRow[]);
        });
        sheetData.getSheetRows("LAYOUTS").then((r) => {
          actions.setLayoutDataGoogleSheet(r as RawLayoutRow[]);
        });
      }
    );
  }),
  setAppGoogleSheetData: action((state, googleSheet) => {
    state.parentGoogleSheet = googleSheet;
  }),
  setCardDataGoogleSheet: action((state, sheet) => {
    state.cardDataGoogleSheet = sheet;
  }),
  setLayoutDataGoogleSheet: action((state, sheet) => {
    state.layoutDataGoogleSheet = sheet;
  }),
  setParentSheetUrl: action((state, parentSheetUrl) => {
    state.parentSheetUrl = parentSheetUrl;
  }),
  setFormUrl: action((state, formUrl) => {
    state.formUrl = formUrl;
  }),
  setCardSheetUrl: action((state, cardSheetUrl) => {
    state.cardSheetUrl = cardSheetUrl;
  }),
  setLayoutsSheetUrl: action((state, layoutSheetUrl) => {
    state.layoutSheetUrl = layoutSheetUrl;
  }),
  setUrlSheet: action((state, urlSheet) => {
    state.urlSheet = urlSheet;
  }),
  addGoogleSheetError: action((state, googleSheetError) => {
    const errorsString = state.googleSheetsErrors.map(
      (error) => JSON.stringify(error) as string
    );
    const newError = JSON.stringify(googleSheetError);
    if (!errorsString.includes(newError)) {
      state.googleSheetsErrors.push(googleSheetError);
    }
  }),
};

export default googleSheetsModel;

/**Converts the key for a google sheet into a url which can be used to fetch as .csv blob */
function googleSheetUrlToCSVUrl(url: string): string {
  const sections = url.split("/");
  const sheetKey = sections[5];
  const sectionsGid = url.split("gid=");
  const gid = sectionsGid[1];
  return `https://docs.google.com/spreadsheets/d/${sheetKey}/export?format=csv&gid=${gid}`;
}

function getSheetData(
  sheetTitle: SheetNames,
  sheetUrl: string
): Promise<LoadSheetResult> {
  let data;
  return new Promise<LoadSheetResult>((resolve, reject) => {
    try {
      Papa.parse(sheetUrl, {
        download: true,
        header: true,
        delimiter: ",",
        dynamicTyping: true,
        complete: (results) => {
          data = results.data;
          console.log(data);
          resolve({ rows: data, sheetTitle: sheetTitle });
        },
      });
    } catch {
      reject("failed to get sheet");
    }
  });
}
