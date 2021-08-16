import type GoogleSheet from "./interfaces/GoogleSheet";
import type SheetId from "./interfaces/SheetId";
import GetSheetDone from "get-sheet-done";
import PublicGoogleSheetsParser from "public-google-sheets-parser";
import EasySheets from "easy-sheets";
export function getSheet<T>(sheetId: SheetId): Promise<GoogleSheet<T>> {
  return new Promise<GoogleSheet<T>>(function (resolve, reject) {
    fetch(
      "https://spreadsheets.google.com/feeds/list/1wQ1TGqnCTmaqqDak1rTRxPMSGSGLMilwrecf7TuqDGc/1/public/values?alt=json"
    ).then((res) => {
      console.log(res);
      res.json();
    });
    // labeledCols(sheetId.key, sheetId.sheet_number)
    GetSheetDone.labeledCols(sheetId.key, sheetId.sheet_number)
      .then((sheet: GoogleSheet<T>) => {
        console.log(sheet);
        resolve(sheet);
      })
      .catch((error: unknown) => {
        console.error(
          `Error: ${error} fetching DOC_KEY ${sheetId.key}, sheet number ${sheetId.sheet_number}`
        );
      });
  });
}

export function formatDate(date: Date | undefined): string {
  if (date) {
    const d = new Date(date);
    let month = "" + (d.getMonth() + 1);
    let day = "" + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  } else {
    return "faulty date";
  }
}
