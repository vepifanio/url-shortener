import { app } from './app'
import dotenv from 'dotenv'
import connectDB from './database'
import { config } from './Config'

dotenv.config()

const PORT = Number(config.get('PORT')) || 3333

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
