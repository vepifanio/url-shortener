import mongoose from 'mongoose'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../../src/app'
import { randomUUID } from 'crypto'
import { UrlProps } from '../../src/application/entity/Url'

describe('Get original url route', () => {
  let mongoServer: MongoMemoryServer

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
  })

  afterAll(async () => {
    await mongoServer.stop()
  })

  beforeEach(async () => {
    const mongoUri = mongoServer.getUri()
    await mongoose.connect(mongoUri, { dbName: randomUUID() })
  })

  afterEach(async () => {
    await mongoose.connection.dropDatabase()
    await mongoose.disconnect()
  })

  it('[GET] /:shortUrlId - should return 200 with the original url', async () => {
    await mongoose.connection.collection<UrlProps>('urls').insertOne({
      id: randomUUID(),
      originalUrl: 'http://test.com',
      shortUrlId: 'short-url-id',
      clicks: 0,
      createdAt: new Date(),
    })

    const result = await request(app).get('/short-url-id')

    expect(result.statusCode).toBe(302)
    expect(result.headers.location).toBe('http://test.com')
  })
})
