import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({
  path: './env',
})

const mongoURI = `mongodb://${process.env.MONGO_INITDB_ROOT_USERNAME}:${process.env.MONGO_INITDB_ROOT_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DB_NAME}?authSource=admin`

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
