import type { SheetNames } from "../enums";

export default class GoogleSheetData {
  title!: string;
  sheetId!: string;
  sheets!: Map<SheetNames, unknown[]>;
  constructor(
    title: string,
    sheetId: string,
  ) {
    this.title = title;
    this.sheetId = sheetId;
    this.sheets = new Map();
  }
  getSheetRows<P>(title: SheetNames): Promise<P[]>{
    // const typedArr = this.rows.map(r=>r as P)
    return new Promise<P[]>((resolve, reject)=>{
      const rowArray = this.sheets.get(title);
      if (rowArray){
        resolve(rowArray.map(r=>r as P))
      } else {
        reject(`sheet with title ${title} did not exist`)
      }
    })
  }
  addSheet(title: SheetNames, rows: unknown[]){
    this.sheets.set(title, rows);
  }
}
