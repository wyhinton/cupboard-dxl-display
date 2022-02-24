import type { Layout, Layouts } from "react-grid-layout";

import type { CardSwapEvent } from "../interfaces/CardEvents";
import type { CardSettings } from "../interfaces/CardSettings";
import type { GridPosition } from "../interfaces/GridPosition";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import extendedLayoutTest from "../static/extendedLayoutTest";
import widgets from "../static/widgets";
import type CardData from "./CardData";
import type WidgetData from "./WidgetData";

export interface GridSettings {
  defaultBackgroundColor: string;
}
export interface LayoutSettings {
  cardSettings: CardSettings[];
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
      this.layoutSettings = JSON.parse(row.layout).layoutSettings;
    } else {
      this.layoutSettings = {
        cardSettings: layout.lg.map((l) => {
          return {
            id: l.i,
            scale: 1,
            backgroundColor: undefined,
            objectPosition: "center",
          };
        }),
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
    if (!this.sources().includes(toAdd.id)) {
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
      if (
        !this.layoutSettings.cardSettings.map((cs) => cs.id).includes(toAdd.id)
      ) {
        this.layoutSettings.cardSettings.push({
          id: toAdd.id,
          scale: 1,
          backgroundColor: undefined,
          objectPosition: "center",
        });
      }
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
  getCardSettings(cardId: string): CardSettings {
    return this.layoutSettings.cardSettings.filter((c) => c.id === cardId)[0];
  }
  setCardScale(id: string, scale: number) {
    if (this.sources().includes(id)) {
      this.layoutSettings.cardSettings.filter((cs) => cs.id === id)[0].scale =
        scale;
    }
    console.log(this.layoutSettings.cardSettings);
  }
  setCardBackgroundColor(id: string, backgroundColor: string) {
    console.log("SETTING CARD SCALE");
    if (this.sources().includes(id)) {
      this.layoutSettings.cardSettings.filter(
        (cs) => cs.id === id
      )[0].backgroundColor = backgroundColor;
    }
    console.log(this.layoutSettings.cardSettings);
  }
  setCardContentFit(id: string, contentFit: string) {
    console.log("SETTING CARD SCALE");
    if (this.sources().includes(id)) {
      this.layoutSettings.cardSettings.filter(
        (cs) => cs.id === id
      )[0].contentFit = contentFit;
    }
    console.log(this.layoutSettings.cardSettings);
  }

  layoutToString(): string {
    const object = {
      layout: this.layout.lg,
      layoutSettings: this.layoutSettings,
    };
    return JSON.stringify(object);
  }
}
function testGetLayout(row: RawLayoutRow): ExtendedLayout {
  const test = JSON.parse(row.layout);
  return test.layout ? test : extendedLayoutTest;
}
