import mongoose from 'mongoose'
import dotenv from 'dotenv'
import { config } from '../Config'

dotenv.config({
  path: './env',
})

const mongoURI = config.get('MONGO_URI')
const dbName = config.get('MONGO_DB_NAME')

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, { dbName })
    console.log('Database connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default connectDB
