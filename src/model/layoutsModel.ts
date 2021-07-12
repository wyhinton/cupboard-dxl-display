import {
  action,
  thunk,
  Thunk,
  Action,
  thunkOn,
  ThunkOn,
  debug,
} from "easy-peasy";
import LayoutData from "../data_structs/LayoutData";
import type GoogleSheet from "../interfaces/GoogleSheet";
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
    (actions, swapInfo, { getState, getStoreState, getStoreActions }) => {
      const curModel = getStoreState() as StoreModel;
      const activeCards = curModel.appModel.activeCards;
      const prevLayout = getState().activeLayout;
      if (prevLayout) {
        prevLayout.swapCard(swapInfo);
        actions.setActiveLayout(prevLayout);
      }
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
