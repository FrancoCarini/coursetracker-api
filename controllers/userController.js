const asyncHandler = require('express-async-handler')

const AppError = require('../utils/appError')
const User = require('../models/User')

const register = asyncHandler(async (req, res) => {
  const user = await User.create(req.body)
  sendTokenResponse(user, 200, res)
})

const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  if (!email || !password) {
    next(new AppError('Please provide an email and a password'), 400)
  }

  const user = await User.findOne({ email }).select('+password')

  if (!user) {
    next(new AppError('Invalid credentials'), 401)
  }

  const matchPassword = await user.matchPassword(password)

  if (!matchPassword) {
    next(new AppError('Invalid credentials'), 401)
  }

  sendTokenResponse(user, 200, res)
})

const update = asyncHandler(async (req, res) => {
  const { name } = req.body

  if (!name) {
    next(new AppError('Please provide all values'), 400)
  }

  const user = await User.findByIdAndUpdate(req.user.id, req.body, {
    new: true,
    runValidators: false,
  })

  res.status(200).json({
    user,
  })
})

const sendTokenResponse = (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken()

  const cookieOptions = {
    httpOnly: true,
    maxAge: process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000,
    sameSite: 'None',
  }

  if (process.env.ENVIRONMENT === 'production') {
    cookieOptions.secure = true
  }

  user.password = undefined

  res.cookie('jwt', token, cookieOptions)
  res.status(statusCode).json({
    token,
    user,
  })
}

module.exports = {
  register,
  login,
  update,
}
