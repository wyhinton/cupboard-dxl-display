import type { RawCardInfoRow } from "./google_sheet";
import { InteractionType } from "../enums";

/**
 *
 */
export default class CardData {
  readonly src: string;
  readonly title: string;
  readonly added?: Date;
  readonly sourceId: string;
  readonly author: string;
  readonly interaction: InteractionType;
  isActive!: boolean;
  // instanceId!: string;

  constructor(row: RawCardInfoRow) {
    console.log(row);
    this.src = row.src;
    this.title = row.title;
    this.added = new Date(row.added);
    this.sourceId = row.src;
    this.author = row.author;
    this.interaction =
      InteractionType[row.interaction as keyof typeof InteractionType];
    this.isActive = false;
  }
  set_active(b: boolean) {
    this.isActive = b;
  }
}
