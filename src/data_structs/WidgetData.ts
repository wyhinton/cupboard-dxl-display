
export type WidgetType = "clock"|"group label"|"info"

interface WidgetCardData{
  widgetType: WidgetType;
}
/**Contains all the information needed to create a display card */
export default class WidgetData {
  readonly id: string;
  isActive: boolean;


  constructor(name: WidgetType) {
    this.id = name as string
    this.isActive = false;
  }
  setActive(b: boolean): void {
    this.isActive = b;
  }

}
 
