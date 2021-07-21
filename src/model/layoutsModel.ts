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
  //listeners
  onLayoutSheetLoadSuccess: ThunkOn<LayoutsModel, never, StoreModel>;
  onToggleViewModeListener: ThunkOn<LayoutsModel, never, StoreModel>;
  //requests

  //simple setters
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;
  setBufferLayout: Action<LayoutsModel, Layouts>;
  updateLayout: Action<LayoutsModel, CardSwapEvent>;

  storeBufferLayout: Action<LayoutsModel>;

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
      const defaultLayout = layouts.filter(
        (l) => l.title === "Default_Layout_1"
      )[0];
      console.log(defaultLayout);
      // actions.setActiveLayout(testDefault);
      actions.setActiveLayout(defaultLayout);
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
      let buf = getState().bufferLayout;
      // let test = target.payload
      if (getStoreState().appModel.appMode === AppMode.DISPLAY) {
        console.log("IT WAS IN DISPLAY MODE");
        if (activeLayout?.layout) {
          activeLayout.layout = buf;
          actions.setActiveLayout(activeLayout);
        }
      }

      // console.log("doing on cart sheet load success");
      // console.log(target.payload);
      // // const baseLayout = LayoutData.base
      // const layouts = target.payload.data.map((l) => new LayoutData(l));
      // // let testDefault = new LayoutData(createDefaultLayout());
      // const defaultLayout = layouts.filter(
      //   (l) => l.title === "Default_Layout_1"
      // )[0];
      // console.log(defaultLayout);
      // // actions.setActiveLayout(testDefault);
      // actions.setActiveLayout();
      // actions.storeBufferLayout();
      // actions.setExternalLayouts(layouts);
      // console.log(layouts);
    }
  ),
  //simple setters
  setActiveLayout: action((state, newActiveLayout) => {
    console.log("setting active layout");
    console.log(newActiveLayout);
    state.activeLayout = newActiveLayout;
  }),
  setExternalLayouts: action((state, newLayoutArr) => {
    console.log("setting external layouts");
    state.externalLayouts = newLayoutArr;
  }),
  //mutators
  swapCardContent: thunk(
    (actions, swapInfo, { getState, getStoreState, getStoreActions }) => {
      const curModel = getStoreState() as StoreModel;
      // const activeCards = curModel.appModel.activeCards;
      const prevLayout = getState().activeLayout;
      if (prevLayout) {
        prevLayout.swapCard(swapInfo);
        actions.setActiveLayout(prevLayout);
      }
    }
  ),
  deleteCard: thunk(
    (actions, cardToDelete, { getState, getStoreState, getStoreActions }) => {
      console.log("deleting card at layotus model");
      console.log(cardToDelete);

      const prevLayout = getState().activeLayout;
      console.log("got here");
      if (prevLayout) {
        console.log("deleting card at model");
        prevLayout.removeCard(cardToDelete);
        actions.setActiveLayout(prevLayout);
      }
    }
  ),
  addCard: thunk((actions, cardAddEvent, { getState, getStoreState }) => {
    console.log("adding card");
    console.log(cardAddEvent);
    // const cardToGet = getStoreState().appModel;
    const state = getStoreState();
    // const availableCards = state.;
    const { availableCards } = getStoreState().appModel;
    const { sourceId, targetPosition } = cardAddEvent;
    const cardToAdd = availableCards.filter((c) => c.sourceId == sourceId)[0];
    const { activeLayout } = getState();
    if (activeLayout) {
      activeLayout?.addCard(cardToAdd, targetPosition);
      actions.setActiveLayout(activeLayout);
      console.log(cardToAdd);
    }
    // {activeLayout} = getState()
    // let buf = getState().bufferLayout;
    // if (activeLayout?.layout) {
    //   activeLayout.layout = buf;
    //   actions.setActiveLayout(activeLayout);
    // }

    // const prevLayout = getState().activeLayout;
    // console.log("got here");
    // if (prevLayout) {
    //   // console.log("deleting card at model");
    //   prevLayout.addCard(cardToAdd, { x: 3, y: 1 });
    //   actions.setActiveLayout(prevLayout);
    // }
  }),
  setBufferLayout: action((state, layouts) => {
    console.log("setting buffer layout");
    console.log(layouts);
    state.bufferLayout = layouts;
  }),
  storeBufferLayout: action((state) => {
    // console.log(debug(state.bufferLayout));
    // if (state.activeLayout) {
    //   let copy = {...state.bufferLayout}
    //   state.activeLayout.layout = state.bufferLayout;
    // }
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
