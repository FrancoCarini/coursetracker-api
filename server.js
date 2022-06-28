const express = require('express')
const dotenv = require("dotenv").config()

const notFoundMiddleware = require('./middlewares/not-found')
const connectDB = require('./db/connect')
const userRouter = require('./routes/userRoutes')
const courseRouter = require('./routes/courseRoutes')

const app = express()

app.use(express.json())

app.use('/api/user', userRouter)
app.use('/api/course', courseRouter)

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