interface AppConfig{
    idleTime: number, 
    sheetLink: string, 
    formLink: string, 
}

const appConfig: AppConfig = {
    idleTime: process.env.NODE_ENV === "development"?100000000:10000000,
    sheetLink: "https://docs.google.com/spreadsheets/d/1BR1AQ5Zmt_o_0dOm9AvDht0G3Q6RXQUhX71Vi4H7tTU/edit#gid=0",
    formLink: "https://forms.gle/nc3UQFtFUtSaF5mu6",
}

export default appConfig