const mongoose = require('mongoose')
const validator = require('validator')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    maxLength: 20,
    trim: true,
    required: [true, 'Please provide a name']
  },
  lastName: {
    type: String,
    minLength: 3,
    maxLength: 20,
    trim: true,
    required: [true, 'Please provide a Last name']
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide a valid email'
    }
  },
  password: {
    type: String,
    required: [true, 'Please provide an password'],
    minLength: 6,
  }
})

module.exports = mongoose.model('User', UserSchema)