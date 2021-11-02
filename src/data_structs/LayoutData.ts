import { Layout, Layouts } from "react-grid-layout";

import type { CardSwapEvent } from "../interfaces/CardEvents";
import type { GridPosition } from "../interfaces/GridPosition";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import extendedLayoutTest from "../static/extendedLayoutTest";
import CardData from "./CardData";

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
}

//TODO: Google form columns and layoutData fields should have the same capitilization
export default class LayoutData {
  readonly title: string;
  readonly author: string;
  readonly added: Date;
  readonly id: string;
  readonly sourceLayout: ExtendedLayout;
  layout: Layouts;
  extendedLayout!: ExtendedLayout;
  constructor(row: RawLayoutRow) {
    this.id = row.title + "_" + row.timestamp;
    this.title = row.title;
    this.author = row.author;
    this.added = new Date(row.timestamp.split(" ")[0]);
    this.sourceLayout = testGetLayout(row);
    this.extendedLayout = testGetLayout(row);
    // this.layout = JSON.parse(row.layout);
    this.layout = this.extendedLayout.layout;
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
  removeCard(toRemove: CardData): void {
    console.log(this.layout);
    for (const [k, v] of Object.entries(this.layout)) {
      for (const [index, layoutValue] of v.entries()) {
        this.layout[k] = v.filter((l) => l.i !== toRemove.sourceId);
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
  resetLayout(): void {
    this.extendedLayout = { ...this.sourceLayout };
    this.layout = { ...this.sourceLayout.layout };
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
}
//TODO: TEMPORRARY!!!!!
function testGetLayout(row: RawLayoutRow): ExtendedLayout {
  const test = JSON.parse(row.layout);
  return test.layout ? test : extendedLayoutTest;
}
