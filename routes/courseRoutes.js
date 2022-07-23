const express = require('express')
const router = express.Router()

const {
  createCourse,
  getAllCourses,
  updateCourse,
  deleteCourse,
  stats,
} = require('../controllers/courseController')
const verifyJWTMiddleware = require('../middlewares/verifyJWTMiddleware')

router.use(verifyJWTMiddleware)

router.route('/').post(createCourse).get(getAllCourses)
router.route('/:id').delete(deleteCourse).patch(updateCourse)
router.get('/stats', stats)

module.exports = router
