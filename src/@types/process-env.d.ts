declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string | number
    MONGO_URI: string
    BASE_URL: string
  }
}
