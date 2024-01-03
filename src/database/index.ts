import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { createMongoUri } from './utils/createMongoUri'

dotenv.config({
  path: './env',
})

const mongoURI = createMongoUri()

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI)
    console.log('Database connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default connectDB
