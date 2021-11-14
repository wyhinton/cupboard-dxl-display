import { InteractionType } from "../enums";
import IFrameValidator from "../IFrameValidator";
import type RawCardRow from "../interfaces/RawCardRow";
import { WidgetType } from "./WidgetData";


export type ContentType = "video"|"image"|"website"|"embed"|"widget"

interface ContentCardData{
  src: string;
  title: string;
  added: Date;
  sourceId: string;
  author: string;
}

interface WidgetCardData{
  widgetType: WidgetType;
}
/**Contains all the information needed to create a display card */
export default class CardData {
  readonly id: string;
  readonly src: string;
  readonly title: string;
  readonly added?: Date;
  readonly sourceId: string;
  readonly author: string;
  readonly interaction: InteractionType;
  readonly contentType: ContentType;
  readonly metaData: ContentCardData | WidgetCardData;
  validator!: IFrameValidator;
  isActive!: boolean;
  failed!: boolean;

  constructor(row: RawCardRow) {
    // console.log(`GOT IMAGE CARD ROW: ${isImgLink(row.src)}`);
    this.id = row.src
    this.src = row.src;
    this.title = row.title;
    this.added = new Date(row.added);
    this.sourceId = row.src;
    this.author = row.author;
    this.interaction =
      InteractionType[row.interaction as keyof typeof InteractionType];
    this.contentType = getContentType(this.src)
    if (this.contentType === "widget" && row.widgetType){
      this.metaData = {
        widgetType: row.widgetType
      }
      this.id = row.widgetType
    } else {
      this.metaData = {
        src: row.src,
        title: row.title,
        added: new Date(row.added),
        sourceId: row.src,
        author: row.author,
      }
      this.id = row.src
    }

    this.isActive = false;
    this.validator = new IFrameValidator(this.src);
    this.failed = false;

    // if ()
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
  if (isEmbed(url) ) return "embed" 
  if (isWebsite(url)) return "website"
  return "widget"

}

function isImgLink(url: string) {
  if (typeof url !== "string") return false;
  const imageReg = /[./](gif|jpg|jpeg|tiff|png)$/i;
  return (
    imageReg.test(url)
  );
}

function isVideo(url: string){
  if (typeof url !== "string") return false;
  const videoReg = /[./](mp4|webm|mov)$/i;
  return (
    videoReg.test(url)
    // url.match(/^http[^\?]*.(jpg|jpeg|gif|png|tiff|bmp)(\?(.*))?$/gim) != null
  );
}

function isEmbed(url: string){
  if (typeof url !== "string") return false;
  return url.includes("embed")
}

function isWebsite(url: string){
  if (typeof url !== "string") return false;
  return url.includes("https")
}