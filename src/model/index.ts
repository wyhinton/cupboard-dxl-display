import type { AppDataModel } from "./appModel";
import appModel from "./appModel";
import type { AppSettingsModel } from "./appSettingsModel";
import appSettingsModel from "./appSettingsModel";
import type { GoogleSheetsModel } from "./googleSheetsModel";
import googleSheetsModel from "./googleSheetsModel";
import type { LayoutsModel } from "./layoutsModel";
import layoutsModel from "./layoutsModel";

//**app store model */
export interface StoreModel {
  appModel: AppDataModel;
  appSettingsModel: AppSettingsModel;
  googleSheetsModel: GoogleSheetsModel;
  layoutsModel: LayoutsModel;
}

const model: StoreModel = {
  appModel,
  appSettingsModel,
  googleSheetsModel,
  layoutsModel,
};

export default model;
