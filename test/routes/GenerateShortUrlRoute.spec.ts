import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { createMongoUri } from '../../src/database/utils/createMongoUri'
import request from 'supertest'
import { app } from '../../src/app'

dotenv.config({
  path: path.resolve('test', '.env.test'),
})

describe('Generate short url route', async () => {
  beforeEach(async () => {
    const mongoUri = createMongoUri()
    await mongoose.connect(mongoUri)
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
