import {
  action,
  thunk,
  Thunk,
  Action,
  thunkOn,
  actionOn,
  ActionOn,
  ThunkOn,
  debug,
} from "easy-peasy";
import LayoutData from "../data_structs/LayoutData";
import type { GoogleSheet, RawLayoutRow } from "../data_structs/google_sheet";
import { getSheet } from "../utils";
import { StoreModel } from "./index";
import CardData from "../data_structs/CardData";
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
  onLayoutSheetLoadSuccess: ThunkOn<LayoutsModel, never, StoreModel>;

  //requests
  // fetchLayoutDataGoogleSheet: Thunk<LayoutsModel>;

  //simple setters
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;

  updateLayout: Action<LayoutsModel, SwapInfo>;
  //update
  swapCardContent: Thunk<LayoutsModel, SwapInfo, StoreModel>;
}

const layoutsModel: LayoutsModel = {
  //state
  activeLayout: undefined,
  externalLayouts: [],

  //listeners
  onLayoutSheetLoadSuccess: thunkOn(
    // targetResolver:
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setLayoutDataGoogleSheet,
    // handler:
    (actions, target) => {
      console.log("diong on cart sheet load success");
      console.log(target.payload);
      const layouts = target.payload.data.map((l) => new LayoutData(l));
      const defaultLayout = layouts.filter(
        (l) => l.title === "Default_Layout_1"
      )[0];
      actions.setActiveLayout(defaultLayout);
      actions.setExternalLayouts(layouts);
      console.log(layouts);
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
      const activeCards = curModel.appModel.activeCards;

      console.log(activeCards);
      const cardToChange = activeCards.filter(
        (c) => c.sourceId === swapInfo.targetId
      );
      actions.updateLayout(swapInfo);
      console.log(cardToChange);
      console.log(swapInfo);
    }
  ),
  updateLayout: action((state, swap) => {
    const old = state.activeLayout;
    if (old) {
      old.swapCard(swap);
      console.log(old.layout);
      state.activeLayout = old;
    }
  }),
};

export default layoutsModel;
