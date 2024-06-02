const router = require('express').Router()
const Student = require('../schemas/Student')
const validator = require('email-validator')
const sendEmail = require("../utils/sendEmail.js")

//Register student

router.post('/register', async (req, res) => {
  const { name, email_address, registration_number } = req.body

  if (name === '' || email_address === '' || registration_number === '') {
    return res.status(400).json({
      error: 'Some fields are empty',
      msg: 'All fields must be filled'
    })
  } else if (!validator.validate(email_address)) {
    return res.status(400).json({
      error: 'Invalid email',
      msg: 'Enter a real email address'
    })
  }

  //Check if email already in use
  const emailExists = await Student.findOne({ email_address: email_address })
  if (emailExists) {
    return res.status(400).json({
      error: 'Email already in use',
      msg: 'Enter a different email address'
    })
  }

  //Check if registration number already in use
  const registrationNumberExists = await Student.findOne({
    registration_number: registration_number
  })
  if (registrationNumberExists) {
    return res.status(400).json({
      error: 'Registration number already in use',
      msg: 'Enter a different registrtion number'
    })
  }

  const student = {
    name: name.toLowerCase(),
    registration_number: registration_number.toLowerCase(),
    email_address: email_address.toLowerCase()
  }
  try {
    const newStudent = new Student(student)
    await newStudent.save()

    //Send email to student if registration is successfull
    await sendEmail(
  email_address,
  'Registered Successfully',
  `Hello ${name},`,
  `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="background-color: #4CAF50; color: white; padding: 10px; text-align: center;">Registration Successful</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>We are excited to inform you that your registration was successful. Here are your details:</p>
    <ul style="list-style: none; padding: 0;">
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email_address}</li>
      <li><strong>Registration Number:</strong> ${registration_number}</li>
    </ul>
    <p>If you have any questions, feel free to contact us.</p>
    <p>Best regards,</p>
    <p><strong>Kabarak University</strong></p>
    <footer style="background-color: #f1f1f1; color: #555; text-align: center; padding: 10px; margin-top: 20px;">
      <p>© 2024 Kabarak University. All rights reserved.</p>
    </footer>
  </div>
  `
)


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
