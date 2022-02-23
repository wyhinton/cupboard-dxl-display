// eslint-disable-next-line simple-import-sort/imports
import React, { useState, useEffect, useRef } from "react";
import {
  useApp,
  useAppSettings,
  useClickAnyWhere,
  useInterval,
  useLayout,
} from "../../hooks";
import { AppMode } from "../../enums";
import appConfig from "../../static/appConfig";
import { useIdle } from "react-use";

const AppTimers = ({ children }: { children: JSX.Element }): JSX.Element => {
  const isIdle = useIdle(appConfig.idleTime, false);
  const { rotationSpeed, rotateLayouts } = useAppSettings();
  const { appMode, toggleAppMode, transitionLayout } = useApp();

  const { reset } = useInterval(() => {
    if (appMode === AppMode.DISPLAY && rotateLayouts) {
      transitionLayout(1);
    }
  }, rotationSpeed);

  useClickAnyWhere(() => {
    reset();
  });

  useEffect(() => {
    if (appMode === AppMode.EDIT) {
      toggleAppMode();
    }
  }, [isIdle]);

  return children;
};

export default AppTimers;
