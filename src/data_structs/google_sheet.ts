export interface GoogleSheet<T> {
  data: Array<T>;
  title: string;
  updated: string;
}

export interface RawCardInfoRow {
  src: string;
  title: string;
}
