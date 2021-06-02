import type { RawCardInfoRow } from "./google_sheet";

export default class CardData {
  readonly src: string;
  readonly title: string;

  constructor(row: RawCardInfoRow) {
    this.src = row.src;
    this.title = row.title;
  }
}
