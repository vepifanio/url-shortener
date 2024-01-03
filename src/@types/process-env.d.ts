declare namespace NodeJS {
  export interface ProcessEnv {
    PORT: string | number
    MONGO_INITDB_ROOT_USERNAME: string
    MONGO_INITDB_ROOT_PASSWORD: string
    MONGO_HOST: string
    MONGO_DB_NAME: string
    BASE_URL: string
  }
}
