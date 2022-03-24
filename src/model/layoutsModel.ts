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
  //state
  activeLayout: LayoutData | undefined;
  externalLayouts: LayoutData[];
  bufferLayout: Layouts;
  layoutErrors: AppError[];
  cardScale: number | undefined;
  cardBackgroundColor: string | undefined;
  cardContentFit: string | undefined;

  //listeners
  onSetAppGoogleSheetData: ThunkOn<LayoutsModel, never, StoreModel>;
  onToggleViewMode: ThunkOn<LayoutsModel, never, StoreModel>;

  //simple setters
  setActiveLayout: Action<LayoutsModel, LayoutData>;
  setExternalLayouts: Action<LayoutsModel, LayoutData[]>;
  setBufferLayout: Action<LayoutsModel, Layouts>;
  updateLayout: Action<LayoutsModel, CardSwapEvent>;
  setCardSettings: Action<LayoutsModel, CardSettings>;
  setCardScale: Action<LayoutsModel, { cardId: string; scale: number }>;
  setCardBackgroundColor: Action<
    LayoutsModel,
    { cardId: string; color: string }
  >;
  setCardContentFit: Action<
    LayoutsModel,
    { cardId: string; contentFit: string }
  >;

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
  cardScale: undefined,
  cardBackgroundColor: undefined,
  cardContentFit: undefined,
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
      target.payload
        .getSheetRows<RawLayoutRow>("LAYOUTS")
        .then((rawLayoutRows) => {
          const { externalLayouts } = getState();
          const currentLayoutIds = new Set(
            externalLayouts.map((layout) => layout.id)
          );
          console.log(rawLayoutRows);
          for (const row of rawLayoutRows) {
            try {
              const l = new LayoutData(row);
              console.log(l);
              if (!currentLayoutIds.has(l.id)) {
                externalLayouts.push(l);
              }
            } catch {
              console.log("FAILED TO MAKE LAYOUT DATA");
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
  setCardSettings: action((state, settings) => {
    console.log(settings);
    const currentSettings =
      state.activeLayout?.sourceLayout.layoutSettings.cardSettings;
    console.log(currentSettings);
  }),
  setCardScale: action((state, { cardId, scale }) => {
    console.log(scale);
    const currentSettings = state.activeLayout?.layoutSettings.cardSettings;
    state.activeLayout?.setCardScale(cardId, scale);
    state.cardScale = scale;
    // state.activeLayout.console.log(currentSettings);
  }),
  setCardBackgroundColor: action((state, { cardId, color }) => {
    console.log(color);
    state.activeLayout?.setCardBackgroundColor(cardId, color);
    state.cardBackgroundColor = color;
    // state.activeLayout.console.log(currentSettings);
  }),
  setCardContentFit: action((state, { cardId, contentFit }) => {
    console.log(contentFit);
    state.activeLayout?.setCardContentFit(cardId, contentFit);
    state.cardContentFit = contentFit;
    // state.activeLayout.console.log(currentSettings);
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

  transitionLayout: thunk((actions, value, { getState }) => {
    actions.setAnimationCounter(getState().animationCounter + 1);
    setTimeout(() => {
      actions.setNextLayout();
    }, 1000);
  }),
};

export default layoutsModel;
