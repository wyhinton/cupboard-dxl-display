interface AppConfig {
  //time for the app to return to display mode after no interactions in edit mode
  idleTime: number;
  //link to the sheet containing the list of different card content
  sheetLink: string;
  //google sheets form link for saving new layouts
  formLink: string;
  gridRows: number;
  gridCols: number;
  gridBottomPadding: number;
  //scale for regular web pages
  defaultIframeScale: number;
  //scale of content which meant for embedding, i.e. includes "embed" in the url
  defaultEmbedScale: number;
  //the default layout from your "layouts" google sheet to display
  defaultLayoutName: string;
  //
  showModeSwitchButton: boolean;
  widgetIds: string[];
  useStaticLayout: boolean;
  rotationDuration: number;
}

const appConfig: AppConfig = {
  idleTime: process.env.NODE_ENV === "development" ? 100000000 : 10000000,
  sheetLink:
    "https://docs.google.com/spreadsheets/d/1BR1AQ5Zmt_o_0dOm9AvDht0G3Q6RXQUhX71Vi4H7tTU/edit#gid=0",
  defaultIframeScale: 0.5,
  defaultEmbedScale: 1.0,
  defaultLayoutName: "Poster2",
  formLink: "https://forms.gle/nc3UQFtFUtSaF5mu6",
  widgetIds: ["clock", "group label", "info"],
  gridRows: 6,
  // gridRows: 5,
  gridCols: 4,
  showModeSwitchButton: false,
  useStaticLayout: false,
  gridBottomPadding: 50,
  // rotationDuration: 10000,
  rotationDuration: 100000,
};

export default appConfig;
