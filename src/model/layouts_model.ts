import {
  action,
  thunk,
  Thunk,
  Action,
  thunkOn,
  ThunkOn,
  debug,
} from "easy-peasy";
import LayoutData from "../data_structs/layout_data";
import type { GoogleSheet, RawLayoutRow } from "../data_structs/google_sheet";
import { getSheet } from "../utils";
import { StoreModel } from "./index";
import CardData from "../data_structs/cardData";
import { Layouts } from "react-grid-layout";

export interface SwapInfo {
  sourceId: string;
  targetId: string;
}

export interface LayoutsModel {
  //state
  activeLayout: LayoutData | undefined;
  externalLayouts: LayoutData[];

  //listeners
  onSetActiveCards: ThunkOn<LayoutsModel, CardData[], StoreModel>;
  //requests
  fetchLayoutDataGoogleSheet: Thunk<LayoutsModel>;

  //simple setters
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;

  updateLayout: Action<LayoutsModel, SwapInfo>;
  //update
  swapCardContent: Thunk<LayoutsModel, SwapInfo, StoreModel>;
}

const layoutsData: LayoutsModel = {
  //state
  activeLayout: undefined,
  externalLayouts: [],
  //requests
  fetchLayoutDataGoogleSheet: thunk(
    async (actions, _, { getState, getStoreState }) => {
      getSheet<RawLayoutRow>(
        "181P-SDszUOj_xn1HJ1DRrO8pG-LXyXNmINcznHeoK8k",
        2
      ).then((sheet) => {
        console.log(getStoreState());

        const layouts = sheet.data.map((l) => new LayoutData(l));
        const defaultLayout = layouts.filter(
          (l) => l.title === "Default_Layout_1"
        )[0];
        actions.setActiveLayout(defaultLayout);
        actions.setExternalLayouts(layouts);
        console.log(layouts);
      });
    }
  ),
  //simple setters
  setActiveLayout: action((state, newActiveLayout) => {
    console.log("setting active layout");
    state.activeLayout = newActiveLayout;
  }),
  setExternalLayouts: action((state, newLayoutArr) => {
    console.log("setting external layouts");
    state.externalLayouts = newLayoutArr;
  }),
  swapCardContent: thunk(
    (actions, swapInfo, { getStoreState, getStoreActions }) => {
      const curModel = getStoreState() as StoreModel;
      const activeCards = curModel.appData.activeCards;

      console.log(activeCards);
      const cardToChange = activeCards.filter(
        (c) => c.instanceId === swapInfo.targetId
      );
      actions.updateLayout(swapInfo);
      console.log(cardToChange);
      console.log(swapInfo);
    }
  ),
  updateLayout: action((state, swap) => {
    const old = state.activeLayout;
    if (old) {
      old.swap_card(swap);
      console.log(old.layout);
      state.activeLayout = old;
    }
  }),
  onSetActiveCards: thunkOn(
    (actions, storeActions) => storeActions.appData.setActiveCards,
    async (actions, payload, { getState }) => {
      console.log("got swap set active cards at layout model");
      console.log(payload.payload);
      console.log(getState().activeLayout?.layout);
      const newIds = payload.payload.map((val) => {
        console.log(val);
        console.log(val.instanceId);
        return val.instanceId;
      });

      const curActiveLayout = getState().activeLayout?.layout;
      console.log(curActiveLayout);
      //   if (curActiveLayout) {
      //     const oldIds = curActiveLayout.lg.map((v) => v.i);
      //     console.log(newIds);
      //     console.log(oldIds);
      //     const missing = oldIds.filter(
      //       (item) => newIds.indexOf(item) < 0 && item !== "clock"
      //     );
      //     console.log(missing);
      //     for (const [k, v] of Object.entries(curActiveLayout)) {
      //       console.log(v);
      //       //   let newval = v.map(vv=>{
      //       //       if
      //       //   })
      //       console.log(k);
      //     }
      //   }
    }
  ),
};

export default layoutsData;
