import type { RawCardInfoRow } from "./google_sheet";
import { v4 as uuidv4 } from "uuid";
/**
 *
 */
export default class CardData {
  readonly src: string;
  readonly title: string;
  readonly added?: Date;

  constructor(row: RawCardInfoRow) {
    this.src = row.src;
    this.title = row.title;
    this.added = new Date(row.added);
  }
}
