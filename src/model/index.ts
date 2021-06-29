import appData, { AppDataModel } from "./appModel";
import historyData, { HistoryModel } from "./historyModel";
import layoutsModel, { LayoutsModel } from "./layoutsModel";
import googleSheetsModel, { GoogleSheetsModel } from "./googleSheetsModel";
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  appModel: AppDataModel;
  historyModel: HistoryModel;
  layoutsModel: LayoutsModel;
  googleSheetsModel: GoogleSheetsModel;
}

const model: StoreModel = {
  appModel: appData,
  historyModel: historyData,
  layoutsModel: layoutsModel,
  googleSheetsModel: googleSheetsModel,
};

export default model;
