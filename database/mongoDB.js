const mongoose = require('mongoose')

const connectToMongoDB = async uri => {
  try {
    mongoose.connect(uri)
    console.log('Connected to MongoDB database successfully.')
  } catch (error) {
    console.error(`There has been an error connecting to database: ${error}`)
  }
}

module.exports = { connectToMongoDB }
