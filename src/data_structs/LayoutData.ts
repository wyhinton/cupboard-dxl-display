import { Layout, Layouts } from "react-grid-layout";

import type { CardSwapEvent } from "../interfaces/CardEvents";
import type { GridPosition } from "../interfaces/GridPosition";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import extendedLayoutTest from "../static/extendedLayoutTest";
import widgets from "../static/widgets";
import CardData from "./CardData";
import WidgetData from "./WidgetData";

export interface CardOptions {
  id: string;
  scale: number;
  backgroundColor: string;
  objectPosition: string;
}

export interface GridSettings {
  defaultBackgroundColor: string;
}
export interface LayoutSettings {
  cardSettings: CardOptions[];
  gridSettings: GridSettings;
}

export interface ExtendedLayout {
  layout: Layouts;
  layoutSettings: LayoutSettings;
  widgets: WidgetData[];
}

export default class LayoutData {
  readonly title: string;
  readonly author: string;
  readonly added: Date;
  readonly id: string;
  readonly sourceLayout: ExtendedLayout;
  readonly layoutSettings: LayoutSettings;
  layout: Layouts;
  layoutWidgets: WidgetData[];

  constructor(row: RawLayoutRow) {
    const { layout } = testGetLayout(row);
    this.id = row.title + "_" + row.timestamp;
    this.title = row.title;
    this.author = row.author;
    this.added = new Date(row.timestamp.split(" ")[0]);
    this.sourceLayout = JSON.parse(row.layout).layout;
    if (JSON.parse(row.layout).layoutSettings) {
      console.log("HAD SETTINGSS");
      this.layoutSettings = JSON.parse(row.layout).layoutSettings;
    } else {
      console.log("NO SETTINGSS");
      this.layoutSettings = {
        cardSettings: [],
        gridSettings: { defaultBackgroundColor: "red" },
      };
      console.log(this.layoutSettings);
    }
    this.layoutWidgets = JSON.parse(row.layout).layoutWidgets
      ? JSON.parse(row.layout).layoutWidgets
      : [];
    this.layout = layout;
  }

  swapCard(swapInfo: CardSwapEvent): void {
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        if (layoutValue.i == swapInfo.targetId) {
          v[index].i = swapInfo.sourceId;
        }
      }
      this.layout[k] = v;
    }
  }

  removeCard(toRemoveId: string): void {
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        this.layout[k] = v.filter((l) => l.i !== toRemoveId);
      }
    }
  }

  clearCards(): void {
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        this.layout[k] = [];
      }
    }
  }

  addCard(toAdd: CardData | WidgetData, pos: GridPosition): void {
    const lg = Object.entries(this.layout)[0][1];
    if (lg.map((l) => l.i).includes(toAdd.id)) {
      console.log("ADDING SOMETHING THAT'S ALREADY PRESENT");
    }
    for (const [k, v] of Object.entries(this.layout)) {
      const newItem: Layout = {
        x: pos.x,
        y: pos.y,
        w: 1,
        h: 1,
        i: toAdd.id,
      };
      this.layout[k].push(newItem);
    }
  }
  addWidget(toAdd: WidgetData, pos: GridPosition): void {
    this.layoutWidgets.push(toAdd);
    for (const [k, v] of Object.entries(this.layout)) {
      const newItem: Layout = {
        x: pos.x,
        y: pos.y,
        w: 1,
        h: 1,
        i: toAdd.id,
      };
      this.layout[k].push(newItem);
    }
  }
  resetLayout(): void {
    this.layout = JSON.parse(JSON.stringify(this.sourceLayout));
  }
  setGridLayout(newGridLayout: Layouts): void {
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        this.layout[k] = newGridLayout[k];
      }
    }
  }
  sources(): string[] {
    const lg = this.layout.lg;
    console.log(lg);
    console.log(this.title);
    return lg.map((l: Layout) => l.i);
  }
  widgets(): string[] {
    const lg = this.layout.lg;
    const justWidgets = lg.filter((l: any) =>
      Object.keys(widgets).includes(l.i)
    );
    return justWidgets.map((l: any) => l.i);
  }
}
function testGetLayout(row: RawLayoutRow): ExtendedLayout {
  const test = JSON.parse(row.layout);
  return test.layout ? test : extendedLayoutTest;
}
