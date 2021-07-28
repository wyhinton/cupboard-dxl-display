import type GoogleSheet from "./interfaces/GoogleSheet";
import type SheetId from "./interfaces/SheetId";
import GetSheetDone from "get-sheet-done";

export function getSheet<T>(sheetId: SheetId): Promise<GoogleSheet<T>> {
  return new Promise<GoogleSheet<T>>(function (resolve, reject) {
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
