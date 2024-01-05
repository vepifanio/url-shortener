import mongoose from 'mongoose'
import request from 'supertest'
import { app } from '../../src/app'
import { randomUUID } from 'node:crypto'
import { config } from '../../src/Config'

describe('Generate short url route', async () => {
  beforeEach(async () => {
    const mongoUri = config.get('MONGO_URI')
    await mongoose.connect(mongoUri, { dbName: randomUUID() })
  })

  afterEach(async () => {
    await mongoose.connection.dropDatabase()
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
