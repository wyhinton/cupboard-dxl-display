interface AppConfig {
  //time for the app to return to display mode after no interactions in edit mode
  idleTime: number;
  //link to the sheet containing the list of different card content
  sheetLink: string;
  //google sheets form link for saving new layouts
  formLink: string;
  //scale for regular web pages
  defaultIframeScale: number;
  //scale of content which meant for embedding, i.e. includes "embed" in the url
  defaultEmbedScale: number;
  //the default layout to display on page load;
  defaultLayoutName: string;
}

const appConfig: AppConfig = {
  idleTime: process.env.NODE_ENV === "development" ? 100000000 : 10000000,
  sheetLink:
    "https://docs.google.com/spreadsheets/d/1BR1AQ5Zmt_o_0dOm9AvDht0G3Q6RXQUhX71Vi4H7tTU/edit#gid=0",
  formLink: "https://forms.gle/nc3UQFtFUtSaF5mu6",
  defaultIframeScale: 0.5,
  defaultEmbedScale: 1.0,
  //   defaultLayoutName: "Full Grid 1",
  defaultLayoutName: "Data Charts",
};

export default appConfig;
