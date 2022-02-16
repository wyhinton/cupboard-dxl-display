import { Layout, Layouts } from "react-grid-layout";

import type { CardSwapEvent } from "../interfaces/CardEvents";
import type { GridPosition } from "../interfaces/GridPosition";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import appConfig from "../static/appConfig";
import extendedLayoutTest from "../static/extendedLayoutTest";
import CardData from "./CardData";
import WidgetData from "./WidgetData";
import imageThumbnail from "image-thumbnail";

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
  layout: Layouts;
  layoutWidgets: WidgetData[];

  constructor(row: RawLayoutRow) {
    const { layout } = testGetLayout(row);
    this.id = row.title + "_" + row.timestamp;
    this.title = row.title;
    this.author = row.author;
    this.added = new Date(row.timestamp.split(" ")[0]);
    this.sourceLayout = JSON.parse(row.layout).layout;
    console.log(JSON.parse(row.layout));

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
    console.log(this.layout);
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        this.layout[k] = v.filter((l) => l.i !== toRemoveId);
      }
    }
  }

  clearCards(): void {
    console.log(this.layout);
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        this.layout[k] = [];
      }
    }
  }

  addCard(toAdd: CardData, pos: GridPosition): void {
    console.log("ADDING CARD AT LAYOUT DATA");
    console.log(this.layout);
    const lg = Object.entries(this.layout)[0][1];
    if (lg.map((l) => l.i).includes(toAdd.sourceId)) {
      console.log("ADDING SOMETHING THAT'S ALREADY PRESENT");
    }
    for (const [k, v] of Object.entries(this.layout)) {
      const newItem: Layout = {
        x: pos.x,
        y: pos.y,
        w: 1,
        h: 1,
        i: toAdd.sourceId,
      };
      this.layout[k].push(newItem);
    }
  }
  addWidget(toAdd: WidgetData, pos: GridPosition): void {
    // console.log("ADDING WIDGET AT LAYOUT DATA", toAdd);
    // console.log(this.layout);
    const lg = Object.entries(this.layout)[0][1];
    if (lg.map((l) => l.i).includes(toAdd.id)) {
      console.log("ADDING A WIDGET THAT'S ALREADY PRESENT");
    }
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
    console.log(newGridLayout);
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        this.layout[k] = newGridLayout[k];
      }
    }
  }
  sources(): string[] {
    const lg = Object.entries(this.layout)[0][1];
    return lg.map((l: any) => l.i);
  }
  widgets(): string[] {
    console.log("GETTING WIDGETS AT WIDGET LAYOUTDATA");
    const lg = Object.entries(this.layout)[0][1];
    console.log(lg);
    const justWidgets = lg.filter((l: any) =>
      appConfig.widgetIds.includes(l.i)
    );
    console.log("just widgets", justWidgets);
    return justWidgets.map((l: any) => l.i);
  }
}
function testGetLayout(row: RawLayoutRow): ExtendedLayout {
  const test = JSON.parse(row.layout);
  return test.layout ? test : extendedLayoutTest;
}
