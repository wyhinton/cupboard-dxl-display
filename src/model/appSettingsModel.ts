import { action, Action, thunk, Thunk } from "easy-peasy";
import appConfig from "../static/appConfig";
import { StoreModel } from "./index";

export interface AppSettingsModel {
  //state
  rotationSpeed: number;
  enableQrCodes: boolean;
  enableIframeInteractions: boolean;
  rotateLayouts: boolean;
  enableIframeAudio: boolean;

  //setter

  setRotationSpeed: Action<AppSettingsModel, number>;
  setRotateLayouts: Action<AppSettingsModel, boolean>;
  setShowQrCodes: Action<AppSettingsModel, boolean>;
  setEnableIframeInteractions: Action<AppSettingsModel, boolean>;
  setEnableIframeAudio: Action<AppSettingsModel, boolean>;
}

const appSettingsModel: AppSettingsModel = {
  //state
  rotationSpeed: appConfig.rotationDuration,
  enableQrCodes: true,
  enableIframeInteractions: false,
  rotateLayouts: true,
  enableIframeAudio: false,
  //setters
  setRotationSpeed: action((state, speed) => {
    state.rotationSpeed = speed;
  }),
  setShowQrCodes: action((state, enableQrCodes) => {
    state.enableQrCodes = enableQrCodes;
  }),
  setEnableIframeInteractions: action((state, enableIframeInteractions) => {
    state.enableIframeInteractions = enableIframeInteractions;
  }),
  setRotateLayouts: action((state, rotateLayouts) => {
    state.rotateLayouts = rotateLayouts;
  }),
  setEnableIframeAudio: action((state, enableIframeAudio) => {
    state.enableIframeAudio = enableIframeAudio;
  }),
};

export default appSettingsModel;
