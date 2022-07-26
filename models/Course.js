const mongoose = require('mongoose')

const CourseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a Title'],
    },
    platform: {
      type: String,
      required: [true, 'Please provide Platform Name'],
    },
    url: {
      type: String,
      required: [true, 'Please provide Course Url'],
    },
    topic: {
      type: String,
      enum: [
        'Backend Programming',
        'Fullstack Programming',
        'Frontend Programming',
        'Databases',
        'HTML',
        'CSS',
        'GIT',
      ],
      required: [true, 'Please provide a valid Topic'],
    },
    status: {
      type: String,
      enum: ['Not started', 'on going', 'finished', 'abandoned'],
      required: [true, 'Please provide a valid State'],
      default: 'Not started',
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('Course', CourseSchema)
