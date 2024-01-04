import { randomUUID } from 'node:crypto'
import { config } from '../../Config'

export function createMongoUri() {
  const {
    MONGO_DB_NAME,
    MONGO_HOST,
    MONGO_INITDB_ROOT_PASSWORD,
    MONGO_INITDB_ROOT_USERNAME,
  } = config.getAll()

  const dbName = process.env.NODE_ENV !== 'test' ? MONGO_DB_NAME : randomUUID()

  return `mongodb://${MONGO_INITDB_ROOT_USERNAME}:${MONGO_INITDB_ROOT_PASSWORD}@${MONGO_HOST}/${dbName}?authSource=admin`
}
