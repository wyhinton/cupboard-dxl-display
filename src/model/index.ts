import appData, { AppDataModel } from "./app_model";
import historyData, { HistoryModel } from "./history_model";
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  appData: AppDataModel;
  historyData: HistoryModel;
  //   notification: NotificationModel;
}

const model: StoreModel = {
  appData,
  historyData,
  //   notification,
};

export default model;
