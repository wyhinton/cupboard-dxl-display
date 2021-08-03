import {
  action,
  thunk,
  Thunk,
  Action,
  thunkOn,
  ThunkOn,
  debug,
} from "easy-peasy";
import CardData from "../data_structs/CardData";
import LayoutData from "../data_structs/LayoutData";
import { StoreModel } from "./index";
import { Layout, Layouts } from "react-grid-layout";
import { CardAddEvent, CardSwapEvent } from "../interfaces/CardEvents";
import defaultLayouts from "../static/defaultLayouts";
import { AppMode } from "../enums";
export interface LayoutsModel {
  //state
  activeLayout: LayoutData | undefined;
  externalLayouts: LayoutData[];
  bufferLayout: Layouts;
  tempLayout: Layouts;
  //listeners
  onLayoutSheetLoadSuccess: ThunkOn<LayoutsModel, never, StoreModel>;
  onToggleViewModeListener: ThunkOn<LayoutsModel, never, StoreModel>;
  //requests

  //simple setters
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;
  setBufferLayout: Action<LayoutsModel, Layouts>;
  setTempLayout: Action<LayoutsModel, Layouts>;
  updateLayout: Action<LayoutsModel, CardSwapEvent>;

  // storeBufferLayout: Action<LayoutsModel>;

  //update
  swapCardContent: Thunk<LayoutsModel, CardSwapEvent, StoreModel>;
  deleteCard: Thunk<LayoutsModel, CardData, StoreModel>;
  addCard: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
}

const layoutsModel: LayoutsModel = {
  //state
  activeLayout: undefined,
  externalLayouts: [],
  bufferLayout: defaultLayouts,
  tempLayout: defaultLayouts,

  //listeners
  onLayoutSheetLoadSuccess: thunkOn(
    // targetResolver:
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setLayoutDataGoogleSheet,
    // handler:
    (actions, target) => {
      console.log("doing on cart sheet load success");
      console.log(target.payload);
      // const baseLayout = LayoutData.base
      const layouts = target.payload.data.map((l) => new LayoutData(l));
      // let testDefault = new LayoutData(createDefaultLayout());
      const defaultLayout = layouts[0];
      // const defaultLayout = layouts.find((l) => l.title === "Default_Layout_1");
      console.log(defaultLayout);
      // actions.setActiveLayout(testDefault);
      if (defaultLayout) {
        actions.setActiveLayout(defaultLayout);
      }
      actions.setExternalLayouts(layouts);
      console.log(layouts);
    }
  ),
  onToggleViewModeListener: thunkOn(
    // targetResolver:
    (actions, storeActions) => storeActions.appModel.toggleViewMode,
    // handler:
    (actions, target, { getState, getStoreState }) => {
      console.log(
        "listened to on toggle view mode in layout model, setting layout from buffer"
      );
      const { activeLayout } = getState();
      const buf = getState().bufferLayout;
      if (getStoreState().appModel.appMode === AppMode.DISPLAY) {
        console.log("IT WAS IN DISPLAY MODE");
        if (activeLayout?.layout) {
          activeLayout.layout = buf;
          actions.setActiveLayout(activeLayout);
        }
      }
    }
  ),
  //simple setters
  setActiveLayout: action((state, newActiveLayout) => {
    console.log("setting active layout");
    console.log(newActiveLayout);
    state.activeLayout = newActiveLayout;
  }),
  setExternalLayouts: action((state, newLayoutArray) => {
    console.log("setting external layouts");
    state.externalLayouts = newLayoutArray;
  }),
  //mutators
  swapCardContent: thunk(
    (actions, swapInfo, { getState, getStoreState, getStoreActions }) => {
      const currentModel = getStoreState() as StoreModel;
      // const activeCards = curModel.appModel.activeCards;
      const { activeLayout } = getState();
      if (activeLayout) {
        const buf = getState().bufferLayout;
        activeLayout.layout = buf;
        activeLayout.swapCard(swapInfo);
        actions.setActiveLayout(activeLayout);
        // actions.setBufferLayout(activeLayout.layout);
      }
    }
  ),
  deleteCard: thunk(
    (actions, cardToDelete, { getState, getStoreState, getStoreActions }) => {
      console.log("deleting card at layotus model");
      console.log(cardToDelete);
      // let buf = getState().bufferLayout;
      const previousLayout = getState().activeLayout;
      console.log("got here");
      const { activeLayout } = getState();
      if (activeLayout) {
        const buf = getState().bufferLayout;
        activeLayout.layout = buf;
        activeLayout.removeCard(cardToDelete);
        actions.setActiveLayout(activeLayout);
      }
    }
  ),
  addCard: thunk((actions, cardAddEvent, { getState, getStoreState }) => {
    console.log("adding card");
    console.log(cardAddEvent);
    const { availableCards } = getStoreState().appModel;
    const { sourceId, targetPosition } = cardAddEvent;
    const cardToAdd = availableCards.find((c) => c.sourceId == sourceId);
    const { activeLayout } = getState();
    if (activeLayout && cardToAdd) {
      const buf = getState().bufferLayout;
      activeLayout.layout = buf;
      activeLayout?.addCard(cardToAdd, targetPosition);
      actions.setActiveLayout(activeLayout);
      // actions.setBufferLayout(activeLayout.layout);
      console.log(cardToAdd);
    }
  }),
  setBufferLayout: action((state, layouts) => {
    console.log("setting buffer layout");
    console.log(layouts);
    state.bufferLayout = layouts;
    // state.tempLayout = layouts;
  }),
  setTempLayout: action((state, layouts) => {
    console.log("setting buffer layout");
    console.log(layouts);
    state.tempLayout = layouts;
  }),
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
