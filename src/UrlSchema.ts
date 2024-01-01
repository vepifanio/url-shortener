import mongoose from 'mongoose'

const UrlSchema = new mongoose.Schema({
  urlId: {
    type: String,
    required: true,
  },
  originUrl: {
    type: String,
    required: true,
  },
  shortUrl: {
    type: String,
    required: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    
  },
})
