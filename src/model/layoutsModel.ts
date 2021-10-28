import CardData from "../data_structs/CardData";
import defaultLayouts from "../static/defaultLayouts";
import LayoutData from "../data_structs/LayoutData";
import RawLayoutRow from "../interfaces/RawLayoutRow";
import { AppMode, SheetNames } from "../enums";
import { CardAddEvent, CardSwapEvent } from "../interfaces/CardEvents";
import { Layouts } from "react-grid-layout";
import { StoreModel } from "./index";
import { action, thunk, Thunk, Action, thunkOn, ThunkOn } from "easy-peasy";
import appConfig from "../static/appConfig";

export interface LayoutsModel {
  //state
  activeLayout: LayoutData | undefined;
  externalLayouts: LayoutData[];
  bufferLayout: Layouts;
  tempLayout: Layouts;

  //listeners
  onSetAppGoogleSheetData: ThunkOn<LayoutsModel, never, StoreModel>;
  onToggleViewModeListener: ThunkOn<LayoutsModel, never, StoreModel>;
  //requests

  //simple setters
  // setActiveLayout: Action<LayoutsModel, te>;
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;
  setBufferLayout: Action<LayoutsModel, Layouts>;
  setTempLayout: Action<LayoutsModel, Layouts>;
  updateLayout: Action<LayoutsModel, CardSwapEvent>;

  //update
  swapCardContent: Thunk<LayoutsModel, CardSwapEvent, StoreModel>;
  deleteCard: Thunk<LayoutsModel, CardData, StoreModel>;
  addCard: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
  registerCardLoadFailure: Thunk<LayoutsModel, CardData, never, StoreModel>;
}

const layoutsModel: LayoutsModel = {
  //state
  activeLayout: undefined,
  externalLayouts: [],
  bufferLayout: defaultLayouts,
  tempLayout: defaultLayouts,

  //listeners
  /**On setAppGoogleSheetData, create an array of LayoutData objects from the provided rows */
  onSetAppGoogleSheetData: thunkOn(
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    (actions, target) => {
      //extract only the needed properties from the GoogleSheetRow
      //TODO: ERROR HANDLING FOR LAYOUTS
      target.payload
        .getSheetRows<RawLayoutRow>(SheetNames.LAYOUTS)
        .then((rows) => {
          console.log(
            "GOT HEREGOT HEREGOT HEREGOT HEREGOT HEREGOT HEREGOT HERE"
          );
          const rawLayoutRows = rows;

          const layouts = rawLayoutRows.map((l) => new LayoutData(l));
          console.log(layouts);
          const defaultLayout = layouts.filter(
            (layout) => layout.title === appConfig.defaultLayoutName
          )[0];
          console.log(defaultLayout);
          if (defaultLayout) {
            actions.setActiveLayout(defaultLayout);
          }
          actions.setExternalLayouts(layouts);
          actions.setBufferLayout(
            layouts.filter(
              (layout) => layout.title === appConfig.defaultLayoutName
            )[0].layout
          );
        });
    }
  ),
  onToggleViewModeListener: thunkOn(
    // targetResolver:toggleAppMode
    (actions, storeActions) => storeActions.appModel.toggleAppMode,
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
    state.activeLayout = newActiveLayout;
  }),
  setExternalLayouts: action((state, newLayoutArray) => {
    console.log("setting external layouts");
    state.externalLayouts = newLayoutArray;
  }),
  //mutators
  swapCardContent: thunk(
    (actions, swapInfo, { getState, getStoreState, getStoreActions }) => {
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
  registerCardLoadFailure: thunk(
    (actions, failedCard, { getState, getStoreState }) => {
      console.log("Got card Register Load Failure at Layouts Model");
      const { activeLayout } = getState();
      if (activeLayout) {
        activeLayout.failCard(failedCard);
      }
    }
  ),
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
