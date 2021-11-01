import type RawCardRow from "../interfaces/RawCardRow";
import { InteractionType } from "../enums";
import IFrameValidator from "../IFrameValidator";


type ContentType = "video"|"image"|"website"|"embed"


/**Contains all the information needed to create a display card */
export default class CardData {
  readonly src: string;
  readonly title: string;
  readonly added?: Date;
  readonly sourceId: string;
  readonly author: string;
  readonly interaction: InteractionType;
  readonly contentType: ContentType;
  // cardOptions!: CardOptions;
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
    this.contentType = getContentType(this.src)
    this.isActive = false;
    this.validator = new IFrameValidator(this.src);
    this.failed = false;
    // this.cardOptions = {row.}
    
    
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
 

function getContentType(url: string): ContentType{
  if (isImgLink(url) ) return "image"
  if (isVideo(url) ) return "video"
  if (isEmbed(url) ){
    return "embed" 
  } else {
    return "website"
  }

}

function isImgLink(url: string) {
  if (typeof url !== "string") return false;
  var imageReg = /[\/.](gif|jpg|jpeg|tiff|png)$/i;
  return (
    imageReg.test(url)
  );
}

function isVideo(url: string){
  if (typeof url !== "string") return false;
  var videoReg = /[\/.](mp4|webm|mov)$/i;
  return (
    videoReg.test(url)
    // url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null
  );
}

function isEmbed(url: string){
  if (typeof url !== "string") return false;
  return url.includes("embed")
}