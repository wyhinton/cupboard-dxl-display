import { Action, action, Thunk, thunk, ThunkOn, thunkOn } from "easy-peasy";
import { Layouts } from "react-grid-layout";

import CardData from "../data_structs/CardData";
import LayoutData from "../data_structs/LayoutData";
import type { SheetNames } from "../enums";
import { AppMode } from "../enums";
import { CardAddEvent, CardSwapEvent } from "../interfaces/CardEvents";
import RawLayoutRow from "../interfaces/RawLayoutRow";
import appConfig from "../static/appConfig";
import defaultStaticLayout from "../static/defaultStaticLayout";
import { StoreModel } from "./index";

export interface LayoutsModel {
  //state
  activeLayout: LayoutData | undefined;
  externalLayouts: LayoutData[];
  bufferLayout: Layouts;
  tempLayout: Layouts;

  //listeners
  onSetAppGoogleSheetData: ThunkOn<LayoutsModel, never, StoreModel>;
  onToggleViewMode: ThunkOn<LayoutsModel, never, StoreModel>;

  //simple setters
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setRandomLayout: Action<LayoutsModel>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;
  setBufferLayout: Action<LayoutsModel, Layouts>;
  setTempLayout: Action<LayoutsModel, Layouts>;
  updateLayout: Action<LayoutsModel, CardSwapEvent>;

  //update
  swapCardContent: Thunk<LayoutsModel, CardSwapEvent, StoreModel>;
  deleteCard: Thunk<LayoutsModel, string, StoreModel>;
  clearCards: Thunk<LayoutsModel, never, StoreModel>;
  addCard: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
  addWidget: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
  registerCardLoadFailure: Thunk<LayoutsModel, CardData, never, StoreModel>;
  resetLayout: Thunk<LayoutsModel, never, StoreModel>;
}

//TODO: Get feedback the whole buffer layout approach
const layoutsModel: LayoutsModel = {
  //state
  activeLayout: undefined,
  externalLayouts: [],
  bufferLayout: defaultStaticLayout.layout,
  tempLayout: defaultStaticLayout.layout,

  //listeners
  /**On setAppGoogleSheetData, create an array of LayoutData objects from the provided rows */
  onSetAppGoogleSheetData: thunkOn(
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    (actions, target) => {
      //TODO: ERROR HANDLING FOR LAYOUTS
      target.payload.getSheetRows<RawLayoutRow>("LAYOUTS").then((rows) => {
        const rawLayoutRows = rows;
        const layouts = rawLayoutRows.map((l) => new LayoutData(l));
        let defaultLayout: LayoutData;
        if (appConfig.useStaticLayout) {
          defaultLayout = defaultStaticLayout;
          actions.setActiveLayout(defaultLayout);
          actions.setBufferLayout(defaultLayout.layout);
        } else {
          const defaultLayout = layouts.filter(
            (layout) => layout.title === appConfig.defaultLayoutName
          )[0];
          if (defaultLayout) {
            console.log(defaultLayout);
            actions.setActiveLayout(defaultLayout);
            actions.setBufferLayout(defaultLayout.layout);
          }
        }
        actions.setExternalLayouts(layouts);
      });
    }
  ),
  onToggleViewMode: thunkOn(
    // targetResolver:toggleAppMode
    (actions, storeActions) => storeActions.appModel.toggleAppMode,
    // handler:
    (actions, target, { getState, getStoreState }) => {
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
    state.activeLayout = newActiveLayout;
  }),
  setRandomLayout: action((state) => {
    const possibleLayouts = state.externalLayouts.filter(
      (l) => l.id !== state.activeLayout?.id
    );
    const selectedRandom =
      possibleLayouts[Math.floor(Math.random() * possibleLayouts.length)];
    console.log(selectedRandom);
    state.activeLayout = selectedRandom;
  }),
  setExternalLayouts: action((state, newLayoutArray) => {
    console.log("setting external layouts");
    state.externalLayouts = newLayoutArray;
  }),
  //mutators
  swapCardContent: thunk((actions, swapInfo, { getState }) => {
    const { activeLayout } = getState();
    if (activeLayout) {
      const buf = getState().bufferLayout;
      activeLayout.layout = buf;
      activeLayout.swapCard(swapInfo);
      actions.setActiveLayout(activeLayout);
    }
  }),
  deleteCard: thunk((actions, cardToDelete, { getState }) => {
    const { activeLayout } = getState();
    if (activeLayout) {
      const buf = getState().bufferLayout;
      activeLayout.layout = buf;
      activeLayout.removeCard(cardToDelete);
      actions.setActiveLayout(activeLayout);
    }
  }),
  clearCards: thunk((actions, _, { getState }) => {
    const { activeLayout } = getState();
    if (activeLayout) {
      const buf = getState().bufferLayout;
      activeLayout.layout = buf;
      activeLayout.clearCards();
      actions.setActiveLayout(activeLayout);
    }
  }),
  addCard: thunk((actions, cardAddEvent, { getState, getStoreState }) => {
    const { availableCards } = getStoreState().appModel;
    const { sourceId, targetPosition } = cardAddEvent;
    const cardToAdd = availableCards.find((c) => c.sourceId == sourceId);
    const { activeLayout } = getState();
    if (activeLayout && cardToAdd) {
      const buf = getState().bufferLayout;
      activeLayout.setGridLayout(buf);
      activeLayout?.addCard(cardToAdd, targetPosition);
      actions.setActiveLayout(activeLayout);
    }
  }),
  addWidget: thunk((actions, cardAddEvent, { getState, getStoreState }) => {
    console.log("ADDING NEW WIDGET!!!");
    const { availableWidgets } = getStoreState().appModel;
    const { sourceId, targetPosition } = cardAddEvent;
    const widgetToAdd = availableWidgets.find((c) => c.id == sourceId);
    const { activeLayout } = getState();
    if (activeLayout && widgetToAdd) {
      const buf = getState().bufferLayout;
      activeLayout.setGridLayout(buf);
      activeLayout?.addWidget(widgetToAdd, targetPosition);
      actions.setActiveLayout(activeLayout);
    }
  }),
  registerCardLoadFailure: thunk(
    (actions, failedCard, { getState, getStoreState }) => {
      const { activeLayout } = getState();
      if (activeLayout) {
        activeLayout.failCard(failedCard);
      }
    }
  ),
  resetLayout: thunk((actions, _, { getState }) => {
    const { activeLayout } = getState();
    if (activeLayout) {
      const buf = getState().activeLayout;
      buf?.resetLayout();
      if (buf) {
        actions.setActiveLayout(buf);
      }
    }
  }),
  setBufferLayout: action((state, layouts) => {
    state.bufferLayout = layouts;
  }),
  setTempLayout: action((state, layouts) => {
    state.tempLayout = layouts;
  }),
  updateLayout: action((state, swap) => {
    const old = state.activeLayout;
    if (old) {
      old.swapCard(swap);
      state.activeLayout = old;
    }
  }),
};

export default layoutsModel;
