import mongoose from 'mongoose'
import request from 'supertest'
import { MongoMemoryServer } from 'mongodb-memory-server'
import { app } from '../../src/app'
import { randomUUID } from 'crypto'
import { UrlProps } from '../../src/application/entity/Url'
import { UrlModel } from '../../src/database/models/UrlModel'

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

  it('[GET] /:shortUrlId - should return 404 when short url id does not exist', async () => {
    const result = await request(app).get('/inexistent-id')

    expect(result.statusCode).toBe(404)
    expect(result.body).toHaveProperty('error')
  })

  it('[GET] /:shortUrlId - should increment click count when redirecting', async () => {
    const urlId = randomUUID()
    await UrlModel.create({
      id: urlId,
      originalUrl: 'http://test.com',
      shortUrlId: 'click-test-id',
      clicks: 0,
      createdAt: new Date(),
    })

    await request(app).get('/click-test-id')

    const updatedUrl = await UrlModel.findOne({ id: urlId })

    expect(updatedUrl?.clicks).toBe(1)
  })
})
