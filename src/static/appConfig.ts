interface AppConfig {
  //time for the app to return to display mode after no interactions in edit mode
  idleTime: number;
  //link to the sheet containing the list of different card content
  //google sheets form link for saving new layouts
  gridRows: number;
  gridCols: number;
  gridBottomPadding: number;
  //scale for regular web pages
  defaultIframeScale: number;
  //scale of content which meant for embedding, i.e. includes "embed" in the url
  defaultEmbedScale: number;
  //the default layout from your "layouts" google sheet to display
  defaultLayoutName: string;
  showModeSwitchButton: boolean;
  widgetIds: string[];
  useStaticLayout: boolean;
  rotationDuration: number;
  noUrlTimeout: number;
  backupParentSheetUrl: string;
}

const appConfig: AppConfig = {
  idleTime: process.env.NODE_ENV === "development" ? 100_000_000 : 10_000_000,
  defaultIframeScale: 0.5,
  defaultEmbedScale: 1,
  defaultLayoutName: "Data Vis Types Chart 1",
  widgetIds: ["clock", "group label", "info"],
  gridRows: 6,
  gridCols: 4,
  showModeSwitchButton: false,
  useStaticLayout: false,
  gridBottomPadding: 50,
  rotationDuration: 100_000, //ms
  noUrlTimeout: 10,
  backupParentSheetUrl: "./backupSheets/BACKUP_PARENT_SHEET",
};

export default appConfig;
