import appModel, { AppDataModel } from "./appModel";
import layoutsModel, { LayoutsModel } from "./layoutsModel";
import googleSheetsModel, { GoogleSheetsModel } from "./googleSheetsModel";
import appSettingsModel, { AppSettingsModel } from "./appSettingsModel";
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  appModel: AppDataModel;
  layoutsModel: LayoutsModel;
  googleSheetsModel: GoogleSheetsModel;
  appSettingsModel: AppSettingsModel;
}

const model: StoreModel = {
  appModel,
  appSettingsModel,
  layoutsModel,
  googleSheetsModel,
};

export default model;
