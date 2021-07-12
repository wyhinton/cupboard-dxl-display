import { Layout, Layouts } from "react-grid-layout";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import type { SwapInfo } from "../model/layoutsModel";
export default class LayoutData {
  readonly title: string;
  readonly author: string;
  readonly added: Date;
  readonly layout: Layouts;

  constructor(row: RawLayoutRow) {
    this.title = row.title;
    this.author = row.author;
    this.added = new Date(row.Timestamp);
    this.layout = JSON.parse(row.layout);
  }
  swapCard(swapInfo: SwapInfo) {
    for (const [k, v] of Object.entries(this.layout)) {
      // console.log(v);
      // console.log(k);
      v.forEach((layoutVal, i) => {
        if (layoutVal.i == swapInfo.targetId) {
          v[i].i = swapInfo.sourceId;
        }
      });
      this.layout[k] = v;
    }
  }
  sources(): string[] {
    return this.layout.lg.map((l) => l.i);
  }
}
