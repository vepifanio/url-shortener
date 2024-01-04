import dotenv from 'dotenv'
import path from 'path'

const envPath =
  process.env.NODE_ENV === 'test'
    ? path.resolve('test', '.env.test')
    : path.resolve('.env')

dotenv.config({
  path: envPath,
})

interface ConfigProps {
  PORT: string | number
  MONGO_INITDB_ROOT_USERNAME: string
  MONGO_INITDB_ROOT_PASSWORD: string
  MONGO_HOST: string
  MONGO_DB_NAME: string
  BASE_URL: string
}

export class Config {
  private props: ConfigProps = {
    PORT: '',
    BASE_URL: '',
    MONGO_INITDB_ROOT_USERNAME: '',
    MONGO_INITDB_ROOT_PASSWORD: '',
    MONGO_HOST: '',
    MONGO_DB_NAME: '',
  }

  constructor() {
    this.props = this.setProps()
  }

  private setProps(): ConfigProps {
    const configPropsKeys = Object.keys(this.props) as Array<keyof ConfigProps>

    for (const key of configPropsKeys) {
      const value = process.env[key]

      if (!value) {
        throw new Error(`${key} is not defined on environment variables.`)
      }

      this.props[key] = value
    }

    return this.props
  }

  get<T extends keyof ConfigProps>(key: T) {
    return this.props[key]
  }

  getAll() {
    return this.props
  }
}

export const config = new Config()
