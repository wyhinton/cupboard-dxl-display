import appData, { AppDataModel } from "./appModel";
import layoutsModel, { LayoutsModel } from "./layoutsModel";
import googleSheetsModel, { GoogleSheetsModel } from "./googleSheetsModel";
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  appModel: AppDataModel;
  layoutsModel: LayoutsModel;
  googleSheetsModel: GoogleSheetsModel;
}

const model: StoreModel = {
  appModel: appData,
  layoutsModel: layoutsModel,
  googleSheetsModel: googleSheetsModel,
};

export default model;
