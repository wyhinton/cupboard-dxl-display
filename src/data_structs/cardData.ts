import type { RawCardInfoRow } from "./google_sheet";
import { v4 as uuidv4 } from "uuid";
/**
 *
 */
export default class CardData {
  readonly src: string;
  readonly title: string;
  readonly added?: Date;
  readonly sourceId: string;
  // instanceId!: string;
  static idCountMap: Map<string, number> = new Map();

  constructor(row: RawCardInfoRow) {
    console.log(row);
    this.src = row.src;
    this.title = row.title;
    this.added = new Date(row.added);
    this.sourceId = row.src;
    // this.sourceId = row.sourceid;
    console.log(CardData.idCountMap.has(row.sourceid));
    // console.log(row.id);
    if (CardData.idCountMap.has(row.sourceid)) {
      console.log("already had id, going to add");
      const beforeVal = CardData.idCountMap.get(row.sourceid) as number;
      CardData.idCountMap.set(row.sourceid, beforeVal + 1);
    } else {
      console.log("adding new row id");
      CardData.idCountMap.set(row.sourceid, 1);
    }
    // CardData.idCountMap.entries().forEach((val)=>{
    //   console.log(val);
    // })
    console.log(Object.keys(CardData.idCountMap));
    // const idCount = CardData.idCountMap.get(row.sourceid);
    // if (idCount) {
    //   this.instanceId = row.sourceid.concat("_", idCount.toString());
    // } else {
    //   this.instanceId = "FAULTY_INSTANCE_ID";
    // }
  }
  clone(): CardData {
    const test = {};
    const sourceId = this.sourceId;
    const sourceInstanceCount = CardData.idCountMap.get(sourceId);
    const old_val = CardData.idCountMap.get(sourceId);
    if (old_val) {
      CardData.idCountMap.set(this.sourceId, old_val + 1);
    }
    console.log(sourceInstanceCount);
    // const rawRowCopy = {

    // }
    const newobj: CardData = Object.assign(test, this);
    const newInstanceId = CardData.idCountMap.get(this.sourceId);

    // if (newInstanceId) {
    //   newobj.instanceId = this.sourceId.concat("_", newInstanceId.toString());
    // }
    console.log(newobj);
    return newobj;
  }
}
