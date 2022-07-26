import type { Action, Computed, Thunk } from "easy-peasy";
import { action, computed, thunk } from "easy-peasy";
import Papa from "papaparse";

import GoogleSheetData from "../data_structs/GoogleSheetData";
import type { SheetNames } from "../enums";
import type AppError from "../interfaces/AppError";
import type PrincipleSheetRow from "../interfaces/PrincipleSheetRow";
import type RawCardRow from "../interfaces/RawCardRow";
import type RawLayoutRow from "../interfaces/RawLayoutRow";

/**
 * Responsible for making requests to google sheets. Other models must listen this model to intercept the sheet payload.
  console.log(query.get("url"));
 * Also stores the fetch data purely for debugging purposes.
 */

export interface GoogleSheetsModel {
  //**Add a new Error related to the Google Sheets Model */
  addGoogleSheetError: Action<GoogleSheetsModel, AppError>;
  //**Array of sheet rows from the Cards Spreadsheet */
  cardDataGoogleSheet: RawCardRow[] | null;
  //**URL of the cards sheet */
  cardSheetUrl: string | undefined;
  //** */
  fetchParentSheet: Thunk<GoogleSheetsModel, string>;
  fetchSheet: Thunk<GoogleSheetsModel, { name: SheetNames; url: string }[]>;
  //**Google Form url for submitting new Layouts */
  formUrl: string | undefined;
  //**Errors related to loading or reading the Parent, Card, or Layouts Google Sheets */
  googleSheetsErrors: AppError[];
  //**Array of sheet rows from the Layouts Spreadsheet */
  layoutDataGoogleSheet: RawLayoutRow[] | null;
  //**URL of the layouts sheet */
  layoutSheetUrl: string | undefined;
  /**GoogleSheetData containing links the Google Form, Cards Spreadsheet, and Layouts Spreadsheet */
  parentGoogleSheet: GoogleSheetData | undefined;
  //**URL of the parent sheet */
  parentSheetUrl: string | undefined;
  //**Returns true if the Google  */
  requests: Promise<GoogleSheetData>[];
  /** reload both the card and layout sheet so updates from the sheets are shown in the editor UI*/
  refreshSheets: Thunk<GoogleSheetsModel>;
  //**set */
  setAppGoogleSheetData: Action<GoogleSheetsModel, GoogleSheetData>;
  setCardDataGoogleSheet: Action<GoogleSheetsModel, RawCardRow[]>;
  /**set cardSheetUrl */
  setCardSheetUrl: Action<GoogleSheetsModel, string>;
  //**Set formUrl */
  setFormUrl: Action<GoogleSheetsModel, string>;
  setLayoutDataGoogleSheet: Action<GoogleSheetsModel, RawLayoutRow[]>;
  //**Set Layouts sheet url */
  setLayoutsSheetUrl: Action<GoogleSheetsModel, string>;
  //**Set Parent Sheet Url */
  setParentSheetUrl: Action<GoogleSheetsModel, string>;
  setUrlSheet: Action<GoogleSheetsModel, string | null>;
  /**Set sheets are loaded */
  sheetsAreLoaded: Computed<GoogleSheetsModel, boolean>;
  //** */
  // testLoad: boolean;
  urlSheet: string | null;
}

interface LoadSheetResult {
  rows: unknown[];
  sheetTitle: SheetNames;
}

const googleSheetsModel: GoogleSheetsModel = {
  addGoogleSheetError: action((state, googleSheetError) => {
    const errorsString = state.googleSheetsErrors.map(
      (error) => JSON.stringify(error) as string
    );
    const newError = JSON.stringify(googleSheetError);
    if (!errorsString.includes(newError)) {
      state.googleSheetsErrors.push(googleSheetError);
    }
  }),
  cardDataGoogleSheet: null,
  cardSheetUrl: undefined,
  fetchParentSheet: thunk((actions, parentSheetUrl) => {
    try {
      getSheetData("TOP_LEVEL", parentSheetUrl)
        .then((r) => {
          const sheetRow = r.rows[0] as PrincipleSheetRow;
          actions.setFormUrl(sheetRow.googleForm);
          actions.setLayoutsSheetUrl(sheetRow.layoutsSheet);
          actions.setCardSheetUrl(sheetRow.cardsSheet);
          actions.setParentSheetUrl(parentSheetUrl);

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
      actions.addGoogleSheetError({
        description:
          "failed to get the mater google sheet, reverting to local svg",
        errorType: "failed to fetch master google sheet",
        link: process.env.REACT_APP_SHEET_URL ?? "NA",
        source: process.env.REACT_APP_SHEET_URL ?? "NA",
      });
    }
  }),
  fetchSheet: thunk(async (actions, sheets, { getState }) => {
    const sheetResponses = sheets.map((s) => getSheetData(s.name, s.url));
    const { cardSheetUrl } = getState();

    if (cardSheetUrl) {
      Promise.allSettled(sheetResponses).then((results) => {
        const sheetData = new GoogleSheetData("DSC App", cardSheetUrl);
        const goodValues: PromiseFulfilledResult<LoadSheetResult>[] = [];

        for (const [number, result] of results.entries()) {
          if (result.status == "fulfilled") {
            goodValues.push(result);
            sheetData.addSheet(result.value.sheetTitle, result.value.rows);
          }
          if (result.status == "rejected") {
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
    } else {
      actions.addGoogleSheetError({
        description: "",
        errorType: "no url for cards provided",
        link: "",
        source: "",
      });
    }
  }),
  formUrl: undefined,
  googleSheetsErrors: [],
  layoutDataGoogleSheet: null,
  layoutSheetUrl: undefined,
  parentGoogleSheet: undefined,
  parentSheetUrl: undefined,
  refreshSheets: thunk(async (actions, _, { getState }) => {
    const { parentSheetUrl } = getState();
    if (parentSheetUrl) {
      actions.fetchParentSheet(parentSheetUrl);
    }
  }),
  requests: [],
  setAppGoogleSheetData: action((state, googleSheet) => {
    state.parentGoogleSheet = googleSheet;
  }),
  setCardDataGoogleSheet: action((state, sheet) => {
    state.cardDataGoogleSheet = sheet;
  }),
  setCardSheetUrl: action((state, cardSheetUrl) => {
    state.cardSheetUrl = cardSheetUrl;
  }),
  setFormUrl: action((state, formUrl) => {
    state.formUrl = formUrl;
  }),
  setLayoutDataGoogleSheet: action((state, sheet) => {
    state.layoutDataGoogleSheet = sheet;
  }),
  setLayoutsSheetUrl: action((state, layoutSheetUrl) => {
    state.layoutSheetUrl = layoutSheetUrl;
  }),
  setParentSheetUrl: action((state, parentSheetUrl) => {
    state.parentSheetUrl = parentSheetUrl;
  }),
  setUrlSheet: action((state, urlSheet) => {
    state.urlSheet = urlSheet;
  }),
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
  urlSheet: null,
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

/**Load a .csv file by url and parse it with Papaparse */
function getSheetData(
  sheetTitle: SheetNames,
  sheetUrl: string
): Promise<LoadSheetResult> {
  let data;
  return new Promise<LoadSheetResult>((resolve, reject) => {
    try {
      Papa.parse(sheetUrl, {
        complete: (results) => {
          data = results.data;
          resolve({ rows: data, sheetTitle: sheetTitle });
        },
        delimiter: ",",
        download: true,
        dynamicTyping: true,
        header: true,
      });
    } catch {
      reject("failed to get sheet");
    }
  });
}
