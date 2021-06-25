export interface GoogleSheet<T> {
  data: Array<T>;
  title: string;
  updated: string;
}

export interface RawCardInfoRow {
  src: string;
  title: string;
  added: string;
  sourceid: string;
  author: string;
  interaction: string;
}

export interface RawLayoutRow {
  title: string;
  author: string;
  added: string;
  layout: string;
}
