import appData, { AppDataModel } from './app_model';
// https://codesandbox.io/s/easy-peasy-typescript-v3-riqbl?file=/src/model/todos.ts

export interface StoreModel {
  appData: AppDataModel;
  //   notification: NotificationModel;
}

const model: StoreModel = {
  appData,
  //   notification,
};

export default model;
