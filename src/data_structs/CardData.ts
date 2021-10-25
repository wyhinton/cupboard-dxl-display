import type RawCardRow from "../interfaces/RawCardRow";
import { InteractionType } from "../enums";
import IFrameValidator from "../IFrameValidator";

/**Contains all the information needed to create a display card */
export default class CardData {
  readonly src: string;
  readonly title: string;
  readonly added?: Date;
  readonly sourceId: string;
  readonly author: string;
  readonly interaction: InteractionType;
  validator!: IFrameValidator;
  isActive!: boolean;
  failed!: boolean;

  constructor(row: RawCardRow) {
    // console.log(`GOT IMAGE CARD ROW: ${isImgLink(row.src)}`);
    this.src = row.src;
    this.title = row.title;
    this.added = new Date(row.added);
    this.sourceId = row.src;
    this.author = row.author;
    this.interaction =
      InteractionType[row.interaction as keyof typeof InteractionType];
    this.isActive = false;
    this.validator = new IFrameValidator(this.src);
    this.failed = false;
  }
  setActive(b: boolean): void {
    this.isActive = b;
  }

  fail(): void {
    console.log(this.validator.errors);
    this.failed = true;
    // this.error =
  }
}

function isImgLink(url: string) {
  if (typeof url !== "string") return false;
  return (
    url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null
  );
}
