const express = require('express')
const dotenv = require("dotenv").config()

const notFoundMiddleware = require('./middlewares/not-found')
const connectDB = require('./db/connect')

const app = express()

app.get('/', (req, res) => {
  res.status(200).json({ message: 'Hola' })
})

app.use(notFoundMiddleware)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen( port, () => {
      console.log(`Server running in port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()