const fs = require('fs')
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()

const connectDB = require('./db/connect')

//Load Models
const User = require('./models/User')
const Course = require('./models/Course')

// //Import into DB
const importData = async () => {
  await connectDB(process.env.MONGO_URL)
  //Read JSON files
  const courses = JSON.parse(
    fs.readFileSync(`${__dirname}/data/courses.json`),
    'utf-8'
  )

  try {
    // Find user
    const user = await User.findOne({ email: process.env.SEEDER_EMAIL })

    // Add user to every item
    const newCourses = courses.map((course) => ({
      ...course,
      user: user._id.toString(),
    }))

    await Course.create(newCourses)

    console.log('Data imported ...')
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

//Delete Data
const deleteData = async () => {
  try {
    await connectDB(process.env.MONGO_URL)
    await Course.deleteMany()
    console.log('Data destroyed ...')
    process.exit()
  } catch (err) {
    console.error(err)
  }
}

if (process.argv[2] === '-i') {
  importData()
} else if (process.argv[2] === '-d') {
  deleteData()
}
