const router = require('express').Router()
const Student = require('../schemas/Student')
const validator = require('email-validator')

//Register student

router.post('/register', async (req, res) => {
  const { name, email_address, registration_number } = req.body

  if (name === '' || email_address === '' || registration_number === '') {
     return res.status(400)
      .json({
        error: 'Some fields are empty',
        msg: 'All fields must be filled'
      })
  } else if (!validator.validate(email_address)) {
    return res.status(400)
      .json({
        error: 'Invalid email',
        msg: 'Enter a real email address'
      })
  }

  //Check if email already in use
  const emailExists = await Student.findOne({ email_address: email_address })
  if (emailExists) {
    return res.status(400)
      .json({
        error: 'Email already in use',
        msg: 'Enter a different email address'
      })
  }

  //Check if registration number already in use
  const registrationNumberExists = await Student.findOne({
    registration_number: registration_number
  })
  if (registrationNumberExists) {
    return res.status(400)
      .json({
        error: 'Registration number already in use',
        msg: 'Enter a different registrtion number'
      })
  }

  const student = {
    name: name,
    registration_number: registration_number,
    email_address: email_address
  }
  try {
    const newStudent = new Student(student)
    await newStudent.save()
    res
      .json({
        error: null,
        msg: 'Student registered successfully'
      })
      .status(200)
  } catch (error) {
    res
      .json({
        error: error,
        msg: 'Student registration unsuccessful'
      })
      .status(500)
  }
})

module.exports = router
