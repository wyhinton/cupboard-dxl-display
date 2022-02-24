import type { AppDataModel } from "./appModel";
import appModel from "./appModel";
import type { AppSettingsModel } from "./appSettingsModel";
import appSettingsModel from "./appSettingsModel";
import type { GoogleSheetsModel } from "./googleSheetsModel";
import googleSheetsModel from "./googleSheetsModel";
import type { LayoutsModel } from "./layoutsModel";
import layoutsModel from "./layoutsModel";
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
