import {
  Action,
  action,
  computed,
  Computed,
  Thunk,
  thunk,
  ThunkOn,
  thunkOn,
} from "easy-peasy";
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
import backupData from "../static/backupLayout.json";
import AppError from "../interfaces/AppError";
export interface LayoutsModel {
  //state
  activeLayout: LayoutData | undefined;
  externalLayouts: LayoutData[];
  bufferLayout: Layouts;
  layoutErrors: AppError[];

  //listeners
  onSetAppGoogleSheetData: ThunkOn<LayoutsModel, never, StoreModel>;
  onToggleViewMode: ThunkOn<LayoutsModel, never, StoreModel>;

  //simple setters
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;
  setBufferLayout: Action<LayoutsModel, Layouts>;
  // setTempLayout: Action<LayoutsModel, Layouts>;
  updateLayout: Action<LayoutsModel, CardSwapEvent>;

  layoutsString: Computed<LayoutsModel, string>;

  //update
  setNextLayout: Thunk<LayoutsModel, never, StoreModel>;
  swapCardContent: Thunk<LayoutsModel, CardSwapEvent, StoreModel>;
  deleteCard: Thunk<LayoutsModel, string, StoreModel>;
  clearCards: Thunk<LayoutsModel, never, StoreModel>;
  addCard: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
  addWidget: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
  resetLayout: Thunk<LayoutsModel, never, StoreModel>;
  addLayoutError: Action<LayoutsModel, AppError>;
}

const layoutsModel: LayoutsModel = {
  //state
  activeLayout: undefined,
  externalLayouts: [],
  layoutErrors: [],
  bufferLayout: backupData as unknown as Layouts,
  layoutsString: computed([(state) => state.bufferLayout], (bufferLayout) => {
    const val = JSON.stringify(bufferLayout);
    return val;
  }),

  //listeners
  /**On setAppGoogleSheetData, create an array of LayoutData objects from the provided rows */
  onSetAppGoogleSheetData: thunkOn(
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    (actions, target, { getState }) => {
      //TODO: ERROR HANDLING FOR LAYOUTS
      target.payload.getSheetRows<RawLayoutRow>("LAYOUTS").then((rows) => {
        const rawLayoutRows = rows;
        const layouts: LayoutData[] = [];
        rawLayoutRows.forEach((row) => {
          try {
            const l = new LayoutData(row);
            layouts.push(l);
          } catch (error) {
            actions.addLayoutError({
              errorType: "failed to read layout row",
              description: `failed to read layout row ${
                row.title ?? "NO TITLE PROVIDED"
              }`,
              source: row.title ?? "NO TITLE PROVIDED",
              link: "none",
            });
            console.log(error);
          }
        });
        let defaultLayout: LayoutData;
        if (appConfig.useStaticLayout) {
          // actions.setActiveLayout(defaultLayout);
          // actions.setBufferLayout(defaultLayout.layout);
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
  addLayoutError: action((state, error) => {
    const errorsString = state.layoutErrors.map(
      (error) => JSON.stringify(error) as string
    );
    const newError = JSON.stringify(error);
    if (!errorsString.includes(newError)) {
      state.layoutErrors.push(error);
    }
  }),
  onToggleViewMode: thunkOn(
    // targetResolver:toggleAppMode
    (actions, storeActions) => storeActions.appModel.manageViewModeChange,
    // handler:
    (actions, target, { getState, getStoreState }) => {
      const { activeLayout, bufferLayout } = getState();
      if (activeLayout) {
        const buf = getState().bufferLayout;
        activeLayout.layout = buf;
        activeLayout.setGridLayout(buf);
        actions.setActiveLayout(activeLayout);
      }
    }
  ),
  //simple setters
  setActiveLayout: action((state, newActiveLayout) => {
    console.log(newActiveLayout);
    state.activeLayout = newActiveLayout;
    state.bufferLayout = JSON.parse(JSON.stringify(newActiveLayout.layout));
  }),
  setNextLayout: thunk((actions, _, { getState }) => {
    const { externalLayouts, activeLayout } = getState();

    // const possibleLayouts = externalLayouts.filter(
    //   (l) => l.id !== activeLayout?.id
    // );
    if (activeLayout) {
      const curIndex = externalLayouts
        .map((l) => l.id)
        .indexOf(activeLayout?.id);
      const nextIndex = (curIndex + 1) % externalLayouts.length;
      console.log(
        `SETTING LAYOUT INDEX TO ${nextIndex} - ${externalLayouts[nextIndex].id} `
      );
      const selectedRandom = externalLayouts[nextIndex];
      console.log(selectedRandom);
      actions.setActiveLayout(selectedRandom);
    }
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
    console.log(layouts);
    state.bufferLayout = JSON.parse(JSON.stringify(layouts));
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
