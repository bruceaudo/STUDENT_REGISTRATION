const mongoose = require('mongoose')

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  registration_number: {
    type: String,
    required: true,
    unique: true
  },
  email_address: {
    type: String,
    required: true,
    unique: true
  },
  date: { type: Date, default: Date.now }
})

const Student = mongoose.model('Students', StudentSchema)

module.exports = Student
