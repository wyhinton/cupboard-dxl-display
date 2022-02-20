import React, { useState, useEffect, useRef } from "react";
import { useApp, useInterval, useLayout } from "../../hooks";
import { AppMode } from "../../enums";
import appConfig from "../../static/appConfig";
import { useIdle } from "react-use";

const AppTimers = ({ children }: { children: JSX.Element }): JSX.Element => {
  const isIdle = useIdle(appConfig.idleTime, false);

  const { appMode, toggleAppMode, rotateLayouts, sheetsAreLoaded } = useApp();

  const { useNextLayout } = useLayout();

  useInterval(() => {
    if (appMode === AppMode.DISPLAY && rotateLayouts) {
      useNextLayout();
    }
  }, appConfig.rotationDuration);

  useEffect(() => {
    if (appMode === AppMode.EDIT) {
      toggleAppMode();
    }
  }, [isIdle]);

  return children;
};

export default AppTimers;
