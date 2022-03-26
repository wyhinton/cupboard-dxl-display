interface AppConfig {
  /**if there is no url?= parameter,use this url to fetch a backup csv stored in the public folder */
  backupParentSheetUrl: string;
  /**default scaling of card content. Useful for high resolution screens. Default value is 1. */
  defaultIframeScale: number;
  //scale of content which meant for embedding, i.e. includes "embed" in the url
  defaultEmbedScale: number;
  //scale for regular web pages
  showModeSwitchButton: boolean;
  useStaticLayout: boolean;
  widgetIds: string[];
  gridSettings: GridSettings;
  timers: AppTimers;
}

interface AppTimers {
  /**time for the app to return to display mode after no interactions in edit mode */
  idleTime: number;
  //**if no url query is provided for parent sheet, seconds before switching to backup layout */
  noUrlTimeout: number;
  //**amount of time a layout is displayed before cycling to the next layout */
  rotationDuration: number;
}

const defaultAppTimers = {
  idleTime: process.env.NODE_ENV === "development" ? 100_000_000 : 10_000_000, //s
  noUrlTimeout: 10, //s
  rotationDuration: 100_000, //ms
};

interface GridSettings {
  //**number of rows in the card grid */
  gridRows: number;
  //**number of columns in the card grid */
  gridCols: number;
  //**bottom padding in px for the card grid */
  gridBottomPadding: number;
}

const defaultGridSettings = {
  gridRows: 6,
  gridCols: 4,
  gridBottomPadding: 50,
};

const appConfig: AppConfig = {
  backupParentSheetUrl: `${process.env.PUBLIC_URL}/backupSheets/BACKUP_PARENT_SHEET.csv`,
  defaultIframeScale: 0.5,
  defaultEmbedScale: 1,
  widgetIds: ["clock", "group label", "info"],
  showModeSwitchButton: false,
  useStaticLayout: false,
  timers: defaultAppTimers,
  gridSettings: defaultGridSettings,
};

export default appConfig;
