import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({
  path: './env',
})

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {})
    console.log('Database connected')
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

export default connectDB
