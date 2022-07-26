import type { Action, Computed, Thunk, ThunkOn } from "easy-peasy";
import { action, computed, thunk, thunkOn } from "easy-peasy";
import type { Layouts } from "react-grid-layout";

import LayoutData from "../data_structs/LayoutData";
import type AppError from "../interfaces/AppError";
import type { CardAddEvent, CardSwapEvent } from "../interfaces/CardEvents";
import type { CardSettings } from "../interfaces/CardSettings";
import type RawLayoutRow from "../interfaces/RawLayoutRow";
import appConfig from "../static/appConfig";
import backupData from "../static/backupLayout.json";
import type { StoreModel } from "./index";

export interface LayoutsModel {
  /**The currently displayed Layout */
  activeLayout: LayoutData | undefined;
  addCard: Thunk<LayoutsModel, CardAddEvent, never, StoreModel>;
  addLayoutError: Action<LayoutsModel, AppError>;
  animationCounter: number;
  bufferLayout: Layouts;
  /**Background color of the currently editing card*/
  cardBackgroundColor: string | undefined;
  cardContentFit: string | undefined;
  cardScale: number | undefined;
  clearCards: Thunk<LayoutsModel, never, StoreModel>;
  deleteCard: Thunk<LayoutsModel, string, StoreModel>;
  /**Array of all layouts from the Layouts Google Sheet */
  externalLayouts: LayoutData[];
  //listeners
  layoutErrors: AppError[];
  layoutsString: Computed<LayoutsModel, string>;
  onSetAppGoogleSheetData: ThunkOn<LayoutsModel, never, StoreModel>;
  /**CSS Scale to apply to all cards in the active layout */
  onToggleViewMode: ThunkOn<LayoutsModel, never, StoreModel>;
  //simple setters
  resetLayout: Thunk<LayoutsModel, never, StoreModel>;
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setAnimationCounter: Action<LayoutsModel, number>;
  setBufferLayout: Action<LayoutsModel, Layouts>;
  setCardBackgroundColor: Action<
    LayoutsModel,
    { cardId: string; color: string }
  >;
  setCardContentFit: Action<
    LayoutsModel,
    { cardId: string; contentFit: string }
  >;
  setCardScale: Action<LayoutsModel, { cardId: string; scale: number }>;
  setCardSettings: Action<LayoutsModel, CardSettings>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;
  //update
  setNextLayout: Thunk<LayoutsModel, never, StoreModel>;
  swapCardContent: Thunk<LayoutsModel, CardSwapEvent, StoreModel>;
  transitionLayout: Thunk<LayoutsModel, number>;
  updateLayout: Action<LayoutsModel, CardSwapEvent>;
}

const layoutsModel: LayoutsModel = {
  activeLayout: undefined,
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
  addLayoutError: action((state, error) => {
    const errorsString = state.layoutErrors.map(
      (error) => JSON.stringify(error) as string
    );
    const newError = JSON.stringify(error);
    if (!errorsString.includes(newError)) {
      state.layoutErrors.push(error);
    }
  }),
  animationCounter: 0,
  bufferLayout: backupData as unknown as Layouts,
  cardBackgroundColor: undefined,
  cardContentFit: undefined,
  cardScale: undefined,
  clearCards: thunk((actions, _, { getState }) => {
    const { activeLayout } = getState();
    if (activeLayout) {
      activeLayout.clearCards();
      actions.setBufferLayout(activeLayout.layout);
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
  externalLayouts: [],
  layoutErrors: [],
  layoutsString: computed([(state) => state.bufferLayout], (bufferLayout) => {
    return JSON.stringify(bufferLayout);
  }),
  onSetAppGoogleSheetData: thunkOn(
    (actions, storeActions) =>
      storeActions.googleSheetsModel.setAppGoogleSheetData,
    (actions, target, { getState }) => {
      target.payload
        .getSheetRows<RawLayoutRow>("LAYOUTS")
        .then((rawLayoutRows) => {
          const { externalLayouts } = getState();
          const currentLayoutIds = new Set(
            externalLayouts.map((layout) => layout.id)
          );
          const receivedLayoutsIds = new Set(
            rawLayoutRows.map((row) => row.title + "_" + row.timestamp)
          );

          //for each of the layout data sheet rows, if the our current rows does not already contain the row, crete a new LayoutData and append
          for (const row of rawLayoutRows) {
            try {
              const layoutId = row.title + "_" + row.timestamp;
              if (!currentLayoutIds.has(layoutId)) {
                const l = new LayoutData(row);
                externalLayouts.push(l);
              }
            } catch {
              actions.addLayoutError({
                description: `failed to read layout row ${
                  row.title ?? "NO TITLE PROVIDED"
                }`,
                errorType: "failed to read layout row",
                link: "none",
                source: row.title ?? "NO TITLE PROVIDED",
              });
            }
          }
          //in case a layout is deleted in the google sheet and then the layouts are refreshed, that needs to be reflected in the UI.
          //so if the rows we received from the layout does not include a layout which we have previously made, remove it from our layout array.
          for (const layout of externalLayouts) {
            if (!receivedLayoutsIds.has(layout.id)) {
              const indexOfLayoutToRemove = externalLayouts.indexOf(layout);
              externalLayouts.splice(indexOfLayoutToRemove, 1);
            }
          }

          const defaultLayout = externalLayouts[0];
          if (defaultLayout) {
            actions.setActiveLayout(defaultLayout);
            actions.setBufferLayout(defaultLayout.layout);
          }
          actions.setExternalLayouts(externalLayouts);
        });
    }
  ),
  onToggleViewMode: thunkOn(
    (actions, storeActions) => storeActions.appModel.manageViewModeChange,
    (actions, target, { getState }) => {
      const { activeLayout } = getState();
      if (activeLayout) {
        const buf = getState().bufferLayout;
        activeLayout.layout = buf;
        activeLayout.setGridLayout(buf);
        actions.setActiveLayout(activeLayout);
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
  setActiveLayout: action((state, newActiveLayout) => {
    state.activeLayout = newActiveLayout;
    state.bufferLayout = JSON.parse(JSON.stringify(newActiveLayout.layout));
  }),
  setAnimationCounter: action((state, value) => {
    state.animationCounter += 1;
  }),
  setBufferLayout: action((state, layouts) => {
    state.bufferLayout = JSON.parse(JSON.stringify(layouts));
  }),
  setCardBackgroundColor: action((state, { cardId, color }) => {
    state.activeLayout?.setCardBackgroundColor(cardId, color);
    state.cardBackgroundColor = color;
  }),
  setCardContentFit: action((state, { cardId, contentFit }) => {
    state.activeLayout?.setCardContentFit(cardId, contentFit);
    state.cardContentFit = contentFit;
  }),
  setCardScale: action((state, { cardId, scale }) => {
    const currentSettings = state.activeLayout?.layoutSettings.cardSettings;
    state.activeLayout?.setCardScale(cardId, scale);
    state.cardScale = scale;
  }),
  setCardSettings: action((state, settings) => {
    const currentSettings =
      state.activeLayout?.sourceLayout.layoutSettings.cardSettings;
  }),
  setExternalLayouts: action((state, newLayoutArray) => {
    state.externalLayouts = newLayoutArray;
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
  swapCardContent: thunk((actions, swapInfo, { getState }) => {
    const { activeLayout } = getState();
    if (activeLayout) {
      const buf = getState().bufferLayout;
      activeLayout.layout = buf;
      activeLayout.swapCard(swapInfo);
      actions.setActiveLayout(activeLayout);
    }
  }),
  transitionLayout: thunk((actions, value, { getState }) => {
    actions.setAnimationCounter(getState().animationCounter + 1);
    setTimeout(() => {
      actions.setNextLayout();
    }, 1000);
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
