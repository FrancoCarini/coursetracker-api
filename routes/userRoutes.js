const express = require('express')
const router = express.Router()

const {
  register,
  login,
  update,
  refresh,
} = require('../controllers/userController')
const verifyJWT = require('../middlewares/verifyJWTMiddleware')

router.post('/register', register)
router.post('/login', login)
router.put('/update', verifyJWT, update)
router.get('/refresh', refresh)

module.exports = router
