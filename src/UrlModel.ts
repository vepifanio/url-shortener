import mongoose, { Schema } from 'mongoose'
import { UrlProps } from './Url'
import { randomUUID } from 'node:crypto'

const UrlSchema = new Schema<UrlProps>({
  id: {
    type: 'UUID',
    required: true,
    default: () => randomUUID(),
  },
  originalUrl: {
    type: 'String',
    required: true,
  },
  shortUrl: {
    type: 'String',
    required: true,
  },
  clicks: {
    type: 'Number',
    required: true,
  },
  createdAt: {
    type: 'Date',
    required: true,
    default: Date.now,
  },
})

export const UrlModel = mongoose.model('Url', UrlSchema)
