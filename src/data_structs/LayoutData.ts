import { Layout, Layouts } from "react-grid-layout";

import type { CardSwapEvent } from "../interfaces/CardEvents";
import type { GridPosition } from "../interfaces/GridPosition";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import appConfig from "../static/appConfig";
import extendedLayoutTest from "../static/extendedLayoutTest";
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

//TODO: Google form columns and layoutData fields should have the same capitilization
export default class LayoutData {
  readonly title: string;
  readonly author: string;
  readonly added: Date;
  readonly id: string;
  readonly sourceLayout: ExtendedLayout;
  layout: Layouts;
  layoutWidgets: WidgetData[];

  constructor(row: RawLayoutRow) {
    const { widgets, layout, layoutSettings } = testGetLayout(row);
    this.id = row.title + "_" + row.timestamp;
    this.title = row.title;
    this.author = row.author;
    this.added = new Date(row.timestamp.split(" ")[0]);
    console.log(row.layout);
    const s = {};
    // Object.assign(s, layout);
    // this.sourceLayout = testGetLayout(row);
    // this.sourceLayout = s;
    // this.sourceLayout = JSON.parse(row.layout).s;
    this.sourceLayout = JSON.parse(row.layout).layout;
    // console.log(JSON.parse(row.layout).layout);
    // console.log(JSON.parse(row.layout));
    console.log(row);
    console.log(JSON.parse(row.layout));

    if (JSON.parse(row.layout).layoutWidgets) {
      this.layoutWidgets = JSON.parse(row.layout).layoutWidgets;
    } else {
      this.layoutWidgets = [];
    }
    // this.layoutWidgets = []
    // this.extendedLayout = testGetLayout(row);
    this.layout = layout;
    // this.layoutWidgets = widgets
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
    // this.layout = { ...this.sourceLayout };
    console.log("RESETING LAYOUT");
    // console.log(this.sourceLayout.layout);
    this.layout = JSON.parse(JSON.stringify(this.sourceLayout));
    // this.layout = { ...this.sourceLayout.layout };
  }
  failCard(toFail: CardData) {
    console.log("FAILING CARD AT LAYOUT DATA");
    // console.log()
  }
  setGridLayout(newGridLayout: Layouts): void {
    console.log(newGridLayout);
    this.layout = newGridLayout;
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
//TODO: TEMPORRARY!!!!!
function testGetLayout(row: RawLayoutRow): ExtendedLayout {
  const test = JSON.parse(row.layout);
  // console.log(row);
  // const test = JSON.parse(row.layout).layt=
  return test.layout ? test : extendedLayoutTest;
}
