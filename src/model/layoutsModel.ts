import type { Action, Computed, Thunk, ThunkOn } from "easy-peasy";
import { action, computed, thunk, thunkOn } from "easy-peasy";
import { Layouts } from "react-grid-layout";

import LayoutData from "../data_structs/LayoutData";
import AppError from "../interfaces/AppError";
import { CardAddEvent, CardSwapEvent } from "../interfaces/CardEvents";
import RawLayoutRow from "../interfaces/RawLayoutRow";
import appConfig from "../static/appConfig";
import backupData from "../static/backupLayout.json";
import { StoreModel } from "./index";

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
  updateLayout: Action<LayoutsModel, CardSwapEvent>;

  layoutsString: Computed<LayoutsModel, string>;

  //update
  setNextLayout: Thunk<LayoutsModel, never, StoreModel>;
  swapCardContent: Thunk<LayoutsModel, CardSwapEvent, StoreModel>;
  deleteCard: Thunk<LayoutsModel, string, StoreModel>;
  clearCards: Thunk<LayoutsModel, never, StoreModel>;
  addCard: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
  resetLayout: Thunk<LayoutsModel, never, StoreModel>;
  addLayoutError: Action<LayoutsModel, AppError>;

  animationCounter: number;
  transitionLayout: Thunk<LayoutsModel, number>;
  setAnimationCounter: Action<LayoutsModel, number>;
}

const layoutsModel: LayoutsModel = {
  //state
  activeLayout: undefined,
  externalLayouts: [],
  layoutErrors: [],
  bufferLayout: backupData as unknown as Layouts,
  layoutsString: computed([(state) => state.bufferLayout], (bufferLayout) => {
    return JSON.stringify(bufferLayout);
  }),

  //listeners
  /**On setAppGoogleSheetData, create an array of LayoutData objects from the provided rows */
  onSetAppGoogleSheetData: thunkOn(
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    (actions, target, { getState }) => {
      target.payload.getSheetRows<RawLayoutRow>("LAYOUTS").then((rows) => {
        const rawLayoutRows = rows;
        // const layouts: LayoutData[] = [];
        const { externalLayouts } = getState();
        // const layouts = getState().externalLayouts
        const currentLayoutIds = new Set(
          externalLayouts.map((layout) => layout.id)
        );

        for (const row of rawLayoutRows) {
          try {
            const l = new LayoutData(row);
            if (!currentLayoutIds.has(l.id)) {
              externalLayouts.push(l);
            }
          } catch (error) {
            actions.addLayoutError({
              errorType: "failed to read layout row",
              description: `failed to read layout row ${
                row.title ?? "NO TITLE PROVIDED"
              }`,
              source: row.title ?? "NO TITLE PROVIDED",
              link: "none",
            });
          }
        }
        if (appConfig.useStaticLayout) {
          // actions.setActiveLayout(defaultLayout);
          // actions.setBufferLayout(defaultLayout.layout);
        } else {
          // const defaultLayout = externalLayouts.filter(
          //   (layout) => layout.title === appConfig.defaultLayoutName
          // )[0];
          const defaultLayout = externalLayouts[0];
          if (defaultLayout) {
            actions.setActiveLayout(defaultLayout);
            actions.setBufferLayout(defaultLayout.layout);
          }
        }
        actions.setExternalLayouts(externalLayouts);
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
    state.activeLayout = newActiveLayout;
    state.bufferLayout = JSON.parse(JSON.stringify(newActiveLayout.layout));
  }),
  setNextLayout: thunk((actions, _, { getState }) => {
    const { externalLayouts, activeLayout } = getState();
    if (activeLayout) {
      const currentIndex = externalLayouts
        .map((l) => l.id)
        .indexOf(activeLayout?.id);
      const nextIndex = (currentIndex + 1) % externalLayouts.length;
      const selectedRandom = externalLayouts[nextIndex];
      actions.setActiveLayout(selectedRandom);
    }
  }),
  setExternalLayouts: action((state, newLayoutArray) => {
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
      activeLayout.clearCards();
      actions.setBufferLayout(activeLayout.layout);
      actions.setActiveLayout(activeLayout);
    }
  }),
  addCard: thunk((actions, cardAddEvent, { getState, getStoreState }) => {
    const { availableCards, availableWidgets } = getStoreState().appModel;
    const { sourceId, targetPosition } = cardAddEvent;
    const cardToAdd = [...availableCards, ...availableWidgets].find(
      (c) => c.id == sourceId
    );
    const { activeLayout } = getState();
    if (activeLayout && cardToAdd) {
      const buf = getState().bufferLayout;
      activeLayout.setGridLayout(buf);
      activeLayout?.addCard(cardToAdd, targetPosition);
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
    state.bufferLayout = JSON.parse(JSON.stringify(layouts));
  }),
  updateLayout: action((state, swap) => {
    const old = state.activeLayout;
    if (old) {
      old.swapCard(swap);
      state.activeLayout = old;
    }
  }),
  animationCounter: 0,
  setAnimationCounter: action((state, value) => {
    state.animationCounter += 1;
  }),

  transitionLayout: thunk((actions, val, { getState }) => {
    actions.setAnimationCounter(getState().animationCounter + 1);
    setTimeout(() => {
      actions.setNextLayout();
    }, 1000);
  }),
};

export default layoutsModel;
