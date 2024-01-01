import express from 'express'

const app = express()

app.get('/', (request, response) => {
  response.send({
    hello: 'world',
  })
})

export { app }
