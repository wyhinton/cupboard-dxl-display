import appData, { AppDataModel } from "./app_model";
import historyData, { HistoryModel } from "./history_model";
import layoutsData, { LayoutsModel } from "./layouts_model";
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  appData: AppDataModel;
  historyData: HistoryModel;
  layoutsData: LayoutsModel;
}

const model: StoreModel = {
  appData,
  historyData,
  layoutsData,
};

export default model;
