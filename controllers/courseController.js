const asyncHandler = require('express-async-handler')

const User = require('../models/User')
const Course = require('../models/Course')
const AppError = require('../utils/appError')

const createCourse = asyncHandler(async (req, res) => {
  req.body.user = req.user
  const course = await Course.create(req.body)
  res.status(201).json(course)
})

const getAllCourses = asyncHandler(async (req, res, next) => {
  const courses = await Course.find({ user: req.user })
  res.status(200).json(courses)
})

const deleteCourse = asyncHandler(async (req, res) => {})

const updateCourse = asyncHandler(async (req, res) => {})

const stats = asyncHandler(async (req, res) => {})

module.exports = {
  createCourse,
  getAllCourses,
  deleteCourse,
  updateCourse,
  stats,
}
