const asyncHandler = require('express-async-handler')
const jwt = require('jsonwebtoken')

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

const update = asyncHandler(async (req, res, next) => {
  const { name } = req.body

  if (!name) {
    next(new AppError('Please provide all values'), 400)
  }

  const user = await User.findByIdAndUpdate(req.user, req.body, {
    new: true,
    runValidators: false,
  })

  res.status(200).json({
    user,
  })
})

const refresh = asyncHandler(async (req, res, next) => {
  const cookies = req.cookies
  if (!cookies?.jwt) return next(new AppError('Unauthorized', 401))

  const refreshToken = cookies.jwt
  const user = await User.findOne({ refreshToken })
  if (!user) return next(new AppError('Not Allowed', 403))

  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
    if (err || user._id.toString() !== decoded.id) {
      return next(new AppError('Not Allowed', 403))
    }

    user.password = undefined
    user.refreshToken = undefined

    //Create token
    const token = user.getSignedJwtToken()

    res.json({ token, user })
  })
})

const sendTokenResponse = async (user, statusCode, res) => {
  //Create token
  const token = user.getSignedJwtToken()

  // Create Access Token
  const refreshToken = user.getSignedRefreshToken()

  // Save Refresh Token in DB
  user.refreshToken = refreshToken
  await user.save()

  user.refreshToken = undefined
  user.password = undefined

  const cookieOptions = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
  }

  if (process.env.ENVIRONMENT === 'production') {
    cookieOptions.secure = true
  }

  res.cookie('jwt', refreshToken, cookieOptions)
  res.status(200).json({ token, user })
}

module.exports = {
  register,
  login,
  update,
  refresh,
}
