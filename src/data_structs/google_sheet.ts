export interface GoogleSheet<T> {
  data: Array<T>;
  title: string;
  updated: string;
}

//describes the column names in a spreadsheet containing card data
export interface RawCardInfoRow {
  src: string;
  title: string;
  added: string;
  sourceid: string;
  author: string;
  interaction: string;
}

//describes the column names in a spreadsheet containing the layouts data
export interface RawLayoutRow {
  title: string;
  author: string;
  added: string;
  layout: string;
  interaction: string;
}
