import mongoose from 'mongoose'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../../src/app'
import { randomUUID } from 'node:crypto'

describe('Generate short url route', () => {
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

  it('[POST] /api/short - should return 201 with the short url', async () => {
    const result = await request(app).post('/api/short').send({
      originalUrl: 'http://test.com',
    })

    expect(result.statusCode).toBe(201)
    expect(result.body).toHaveProperty('shortUrl')
    expect(result.body).toHaveProperty('shortUrlId')
  })
})
