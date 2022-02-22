import { WidgetType } from "../data_structs/WidgetData";

const clock = { id: "clock" as WidgetType, w: 2, h: 2 };
const info = { id: "info" as WidgetType, w: 1, h: 1 };

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
