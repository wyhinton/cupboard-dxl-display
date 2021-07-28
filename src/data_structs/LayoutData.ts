import { Layout, Layouts } from "react-grid-layout";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import type { CardSwapEvent, CardAddEvent } from "../interfaces/CardEvents";
import CardData from "./CardData";
import { Ok, Err, Result } from "ts-results";
import defaultLayouts from "../static/defaultLayouts";
import { v4 as uuidv4 } from "uuid";
import type { GridPosition } from "../interfaces/GridPosition";

export default class LayoutData {
  readonly title: string;
  readonly author: string;
  readonly added: Date;
  layout: Layouts;
  //TODO: Make this more functional
  constructor(row: RawLayoutRow) {
    this.title = row.title;
    this.author = row.author;
    this.added = new Date(row.Timestamp);
    ///SAVE SAVE SAVE
    const startLayout: Layouts = JSON.parse(row.layout);
    console.log(startLayout);
    //TEMP TRIM DEFAULT LAYOUT TO TEST
    for (const [k, v] of Object.entries(startLayout)) {
      startLayout[k] = v.slice(0, 3);
    }

    this.layout = startLayout;
    ///SAVE SAVE SAVE

    const emptyPositions = findEmptyGridPositions(defaultLayouts.lg, 3, 4);
    const finalLayouts = generateFilledLayout(
      defaultLayouts.lg,
      emptyPositions
    );
    console.log(defaultLayouts);
    console.log(finalLayouts);
    console.log(emptyPositions);
    // this.layout = finalLayouts;
    // this.layout = finalLayouts;
    this.layout = defaultLayouts;

    // this.layout = JSON.parse(row.layout);
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
        // console.log(layoutVal);
        this.layout[k] = v.filter((l) => l.i !== toRemove.sourceId);
        // if (layoutVal.i == toRemove.sourceId) {
        //   console.log(layoutVal);
        // }
      }
    }
  }
  addCard(toAdd: CardData, pos: GridPosition): void {
    console.log("ADDING CARD AT LAYOUT DATA");
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
  setGridLayout(newGridLayout: Layouts): void {
    console.log(newGridLayout);
    this.layout = newGridLayout;
  }
  sources(): string[] {
    return this.layout.lg.map((l) => l.i);
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
  const stringFilledSpots = new Set(filledSpots.map((fs) => [fs.x, fs.y].toString()));

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

function parseLayout(
  data: string
): Result<Layouts, "failed to parse layoutJSON"> {
  try {
    const layouts = JSON.parse(data);
    return Ok(layouts);
  } catch {
    return Err("failed to parse layoutJSON");
  }
}

function generateFilledLayout(
  layout: Layout[],
  emptyPosArray: GridPosition[]
): Layouts {
  const emptyCards = emptyPosArray.map((rr) => {
    return {
      x: rr.x,
      y: rr.y,
      w: 1,
      h: 1,
      i: `empty_card_${uuidv4()}`,
      minW: 1,
      maxW: 1,
      minH: 1,
      maxH: 1,
      static: true,
      isDraggable: false,
      isResizable: false,
      resizeHandles: [],
    } as Layout;
  });
  const filled = layout.concat(emptyCards);
  return {
    lg: filled,
    md: filled,
    sm: filled,
    xs: filled,
    xxs: filled,
  };
}
// function getCount(): Promise<Result<number, Error>> {
//   return fetch("/index-count")
//     .then((res) => res.json())
//     .then((body): Ok<number, Error> => ok(body["count"]))
//     .catch(() => err(new Error("Something when wrong while fetching count")));
// }

// // To access the count, we'll first have to check if the calculation succeeded.
// if (res.isOk()) {
//   // Now we can access the value.
//   console.log("Count is:", res.value);
// }

// if (res.isErr()) {
//   // Now we can access the error.
//   console.error("Oh no, there was an error:", res.error);
// }

// // https://dev.to/duunitori/mimicing-rust-s-result-type-in-typescript-3pn1
// // type Result =
// //   | { success: true; value: unknown }
// //   | { success: false; error: Error };

// export type Result<T, E> = Ok<T, E> | Err<T, E>;

// export class Ok<T, E> {
//   public constructor(public readonly value: T) {}

//   public isOk(): this is Ok<T, E> {
//     return true;
//   }

//   public isErr(): this is Err<T, E> {
//     return false;
//   }
// }

// export class Err<T, E> {
//   public constructor(public readonly error: E) {}

//   public isOk(): this is Ok<T, E> {
//     return false;
//   }

//   public isErr(): this is Err<T, E> {
//     return true;
//   }
// }

// /**
//  * Construct a new Ok result value.
//  */
// export const ok = <T, E>(value: T): Ok<T, E> => new Ok(value);

// /**
//  * Construct a new Err result value.
//  */
// export const err = <T, E>(error: E): Err<T, E> => new Err(error);
