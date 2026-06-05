import dotenv from 'dotenv'
import path from 'path'

dotenv.config({
  path: path.resolve('.env'),
})

interface ConfigProps {
  PORT: string
  MONGO_URI: string
  MONGO_DB_NAME: string
  BASE_URL: string
  REDIS_HOST?: string
  REDIS_PORT?: string
  REDIS_TTL?: string
}

export class Config {
  private props: ConfigProps = {
    PORT: '',
    MONGO_DB_NAME: '',
    MONGO_URI: '',
    BASE_URL: '',
    REDIS_HOST: 'localhost',
    REDIS_PORT: '6379',
    REDIS_TTL: '3600',
  }

  constructor() {
    this.props = this.setProps()
  }

  private setProps(): ConfigProps {
    const configPropsKeys = Object.keys(this.props) as Array<keyof ConfigProps>

    for (const key of configPropsKeys) {
      const value = process.env[key]

      // Required fields
      if (!value && ['PORT', 'MONGO_URI', 'MONGO_DB_NAME', 'BASE_URL'].includes(key)) {
        throw new Error(`${key} is not defined on environment variables.`)
      }

      // Optional fields - use defaults if not provided
      if (value) {
        this.props[key] = value
      }
    }

    return this.props
  }

  get<T extends keyof ConfigProps>(key: T) {
    return this.props[key]
  }
}

export const config = new Config()
