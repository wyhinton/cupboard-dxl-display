import { ConsoleIcon } from "evergreen-ui";
import {
  GoogleSpreadsheet,
  GoogleSpreadsheetRow,
  GoogleSpreadsheetWorksheet,
} from "google-spreadsheet";

export default class GoogleSheetData {
  title!: string;
  sheetId!: string;
  sheets!: GoogleSpreadsheetRow[][];

  constructor(
    title: string,
    sheetId: string,
    sheets: GoogleSpreadsheetRow[][]
  ) {
    this.title = title;
    this.sheetId = sheetId;
    this.sheets = sheets;
  }
  getSheetRows(sheetIndex: number): GoogleSpreadsheetRow[] {
    return this.sheets[sheetIndex];
  }
  loadSheets(
    sheetId: string,
    apikey: string
  ): Promise<Promise<GoogleSpreadsheetRow[]>[]> {
    const document = new GoogleSpreadsheet(sheetId);
    document.useApiKey(apikey);
    const sheetPromiseArray: Promise<GoogleSpreadsheetRow[]>[] = [];
    return document.loadInfo().then(() => {
      document.sheetsByIndex.forEach((element) => {
        const myTest = element.getRows();
        console.log(myTest);
        sheetPromiseArray.push(myTest);
      });
      return sheetPromiseArray;
    });
  }
}
