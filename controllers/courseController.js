const asyncHandler = require('express-async-handler')
const mongoose = require('mongoose')

const User = require('../models/User')
const Course = require('../models/Course')
const AppError = require('../utils/appError')

const createCourse = asyncHandler(async (req, res) => {
  req.body.user = req.user
  const course = await Course.create(req.body)
  res.status(201).json(course)
})

const getAllCourses = asyncHandler(async (req, res, next) => {
  let query

  //Copy req.query
  const reqQuery = { ...req.query }

  reqQuery.user = req.user

  //Fields to exclude
  const removeFields = ['sort', 'page', 'limit']

  //Loop over removeFields and delete them from reqQuery
  removeFields.forEach((param) => delete reqQuery[param])

  // Find if exist title, platform
  if (reqQuery.hasOwnProperty('title')) {
    reqQuery.title = { $regex: reqQuery.title, $options: 'i' }
  }

  if (reqQuery.hasOwnProperty('platform')) {
    reqQuery.platform = { $regex: reqQuery.platform, $options: 'i' }
  }

  // Check if status is all
  if (reqQuery.status === 'all') {
    delete reqQuery.status
  }

  // Check if topic is all
  if (reqQuery.topic === 'all') {
    delete reqQuery.topic
  }

  //Create query string
  let queryStr = JSON.stringify(reqQuery)

  // Base query find method
  query = Course.find(JSON.parse(queryStr))

  // Sort
  switch (req.query.sort) {
    case 'latest':
      query.sort('-createdAt')
      break
    case 'oldest':
      query.sort('createdAt')
      break
    case 'a-z':
      query.sort('title')
      break
    case 'z-a':
      query.sort('-title')
      break
    default:
      break
  }

  // Pagination
  const page = parseInt(req.query.page, 10) || 1
  const limit = parseInt(req.query.limit, 10) || 10
  const startIndex = (page - 1) * limit
  const endIndex = page * limit
  const total = await Course.countDocuments(JSON.parse(queryStr))
  const numOfPages = Math.ceil(total / limit)

  query = query.skip(startIndex).limit(limit)

  //Executing query
  const results = await query

  // Pagination result
  const pagination = {}
  pagination.numOfPages = numOfPages
  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit,
    }
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit,
    }
  }

  res.status(200).json({
    totalCourses: results.length,
    pagination,
    courses: results,
  })
})

const deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id)

  // check course existance
  if (!course) {
    next(new AppError('Course does not exists', 404))
  }

  // Check if belongs to user
  if (course.user.toString() !== req.user) {
    next(new AppError('Not Allowed', 405))
  }

  await course.remove()

  res.sendStatus(200)
})

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id)

  // check course existance
  if (!course) {
    next(new AppError('Course does not exists', 404))
  }

  // Check if belongs to user
  if (course.user.toString() !== req.user) {
    next(new AppError('Not Allowed', 405))
  }

  // Update
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  })

  res.status(200).json({
    course,
  })
})

const stats = asyncHandler(async (req, res) => {
  const courses = await Course.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(req.user),
      },
    },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
      },
    },
  ])

  const stats = courses.reduce((acc, curr) => {
    const { _id, count } = curr
    acc[_id] = count
    return acc
  }, {})

  res.status(200).json({
    stats,
  })
})

module.exports = {
  createCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
  stats,
}
