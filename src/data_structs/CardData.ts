import type RawCardRow from "../interfaces/RawCardRow";
import { InteractionType } from "../enums";
import IFrameValidator from "../IFrameValidator";
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
  // error: undefined | 
  validator!: IFrameValidator;
  isActive!: boolean;
  failed!: boolean;
  // instanceId!: string;

  constructor(row: RawCardRow) {
    this.src = row.src;
    this.title = row.title;
    this.added = new Date(row.added);
    this.sourceId = row.src;
    this.author = row.author;
    this.interaction =
      InteractionType[row.interaction as keyof typeof InteractionType];
    this.isActive = false;
    this.validator = new IFrameValidator(this.src)
    this.failed = false; 
    // this.error = undefined;
  }
  setActive(b: boolean): void {
    this.isActive = b;
  }
  fail(){
    console.log(this.validator.errors);
    this.failed = true; 
    // this.error = 
  }
}
