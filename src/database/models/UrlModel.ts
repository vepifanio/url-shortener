import mongoose, { Schema } from 'mongoose'
import { UrlProps } from '../../application/entity/Url'
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
  shortUrlId: {
    type: 'String',
    required: true,
  },
  clicks: {
    type: 'Number',
    required: true,
    default: 0,
  },
  createdAt: {
    type: 'Date',
    required: true,
    default: Date.now,
  },
})

export const UrlModel = mongoose.model('Url', UrlSchema)
