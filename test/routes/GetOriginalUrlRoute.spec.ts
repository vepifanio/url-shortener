import dotenv from 'dotenv'
import mongoose from 'mongoose'
import path from 'path'
import { createMongoUri } from '../../src/database/utils/createMongoUri'
import request from 'supertest'
import { app } from '../../src/app'
import { randomUUID } from 'crypto'
import { UrlProps } from '../../src/application/entity/Url'

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

  it('[GET] /:shortUrlId - should return 200 with the original url', async () => {
    await mongoose.connection.collection<UrlProps>('urls').insertOne({
      id: randomUUID(),
      originalUrl: 'http://test.com',
      shortUrlId: 'short-url-id',
      clicks: 0,
      createdAt: new Date(),
    })

    const result = await request(app).get('/short-url-id')

    expect(result.statusCode).toBe(200)
    expect(result.body).toHaveProperty('originalUrl')
    expect(result.body.originalUrl).toBe('http://test.com')
  })
})
