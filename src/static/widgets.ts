import { WidgetType } from "../data_structs/WidgetData";

const clock = { id: "clock" as WidgetType, w: 2, h: 2 };
const info = { id: "info" as WidgetType, w: 2, h: 2 };

export interface WidgetInfo {
  id: WidgetType;
  w: number;
  h: number;
}

type Widgets = {
  [k in WidgetType]: { id: WidgetType; w: number; h: number };
};

const widgets: Widgets = {
  clock,
  info,
};

export default widgets;
