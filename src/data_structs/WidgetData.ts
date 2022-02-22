import { WidgetInfo } from "../static/widgets";
import { ContentType } from "./CardData";

export type WidgetType = "clock" | "info";

/**Contains all the information needed to create a display card */
export default class WidgetData {
  readonly id: WidgetType;
  readonly contentType: ContentType;
  readonly w: number;
  readonly h: number;

  isActive: boolean;

  constructor(data: WidgetInfo) {
    // constructor(name: WidgetType) {
    this.id = data.id;
    this.w = data.w;
    this.h = data.h;
    // this.id = name as string;
    this.isActive = false;
    this.contentType = "widget";
  }
  setActive(b: boolean): void {
    this.isActive = b;
  }
}
