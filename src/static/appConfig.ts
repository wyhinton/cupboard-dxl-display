interface AppConfig{
    idleTime: number
}

const appConfig: AppConfig = {
    idleTime: process.env.NODE_ENV === "development"?100000000:10000000
}

export default appConfig