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

//in case the layout doe not provide any card settings
const defaultCardSettings = {
  backgroundColor: undefined,
  objectPosition: "center",
  scale: 1,
};

const defaultGridSettings = {
  defaultBackgroundColor: "red",
};

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

    this.layoutSettings = JSON.parse(row.layout).layoutSettings
      ? JSON.parse(row.layout).layoutSettings
      : {
          cardSettings: layout.lg.map((l) => {
            return {
              id: l.i,
              ...defaultCardSettings,
            };
          }),
          gridSettings: defaultGridSettings,
        };
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
          w: 1,
          x: pos.x,
          h: 1,
          y: pos.y,
          i: toAdd.id,
        };
        this.layout[k].push(newItem);
      }
      if (
        !this.layoutSettings.cardSettings.map((cs) => cs.id).includes(toAdd.id)
      ) {
        this.layoutSettings.cardSettings.push({
          backgroundColor: undefined,
          id: toAdd.id,
          objectPosition: "center",
          scale: 1,
        });
      }
    }
  }
  addWidget(toAdd: WidgetData, pos: GridPosition): void {
    this.layoutWidgets.push(toAdd);
    for (const [k, v] of Object.entries(this.layout)) {
      const newItem: Layout = {
        w: 1,
        x: pos.x,
        h: 1,
        y: pos.y,
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
  setCardScale(id: string, scale: number): void {
    if (this.sources().includes(id)) {
      this.layoutSettings.cardSettings.filter((cs) => cs.id === id)[0].scale =
        scale;
    }
  }
  setCardBackgroundColor(id: string, backgroundColor: string): void {
    if (this.sources().includes(id)) {
      this.layoutSettings.cardSettings.filter(
        (cs) => cs.id === id
      )[0].backgroundColor = backgroundColor;
    }
  }
  setCardContentFit(id: string, contentFit: string): void {
    if (this.sources().includes(id)) {
      this.layoutSettings.cardSettings.filter(
        (cs) => cs.id === id
      )[0].contentFit = contentFit;
    }
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
