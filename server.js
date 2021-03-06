const express = require('express')
const dotenv = require('dotenv').config()
const cors = require('cors')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')

const connectDB = require('./db/connect')
const notFoundMiddleware = require('./middlewares/notFoundMiddleware')
const errorHandler = require('./middlewares/errorsMiddleware')
const userRouter = require('./routes/userRoutes')
const courseRouter = require('./routes/courseRoutes')
const corsOptions = require('./utils/cors')

const app = express()

if (process.env.ENVIRONMENT !== 'production') {
  app.use(morgan('dev'))
}

// Body parser
app.use(express.json())

// Cookie Parser
app.use(cookieParser())

app.use(cors(corsOptions))

app.use('/api/users', userRouter)
app.use('/api/courses', courseRouter)

app.use(notFoundMiddleware)

app.use(errorHandler)

const port = process.env.PORT || 5000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    app.listen(port, () => {
      console.log(`Server running in port ${port}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
