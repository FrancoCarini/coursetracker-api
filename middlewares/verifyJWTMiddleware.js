const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')

const AppError = require('../utils/appError')

const verifyJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return next(new AppError('Missing Token', 401))

  const token = req.headers.authorization.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded.id
    next()
  } catch (err) {
    console.log(err)
    return next(new AppError('Expired Token', 401))
  }
})

module.exports = verifyJWT
