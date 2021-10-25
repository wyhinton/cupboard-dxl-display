import CardData from "./CardData";
import { Layout, Layouts } from "react-grid-layout";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import type { CardSwapEvent, CardAddEvent } from "../interfaces/CardEvents";
import type { GridPosition } from "../interfaces/GridPosition";

//TODO: Google form columns and layoutData fields should have the same capitilization
export default class LayoutData {
  readonly title: string;
  readonly author: string;
  readonly added: Date;
  readonly id: string;
  layout: Layouts;
  constructor(row: RawLayoutRow) {
    this.id = row.title + "_" + row.timestamp;
    this.title = row.title;
    this.author = row.author;
    this.added = new Date(row.timestamp.split(" ")[0]);
    const startLayout: Layouts = JSON.parse(row.layout);
    this.layout = startLayout;
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

function findEmptyGridPositions(
  layouts: Layout[],
  rows: number,
  cols: number
): GridPosition[] {
  const allGridSpots: GridPosition[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      allGridSpots.push({ x: x, y: y });
    }
  }
  const filledSpots = findFilledPositions(layouts);
  const stringFilledSpots = new Set(
    filledSpots.map((fs) => [fs.x, fs.y].toString())
  );

  return allGridSpots.filter(
    (gs) => !stringFilledSpots.has([gs.x, gs.y].toString())
  );
}

function findFilledPositions(layouts: Layout[]): GridPosition[] {
  const takenSpots: GridPosition[] = [];
  for (const l of layouts) {
    takenSpots.push({ x: l.x, y: l.y });
    for (let index = 1; index < l.w; index++) {
      const fullSpotX: GridPosition = {
        x: l.x + index,
        y: l.y,
      };
      takenSpots.push(fullSpotX);
    }
    for (let index = 1; index < l.h; index++) {
      const fullSpotY: GridPosition = {
        x: l.x,
        y: l.y + index,
      };
      takenSpots.push(fullSpotY);
    }
  }
  return takenSpots;
}
