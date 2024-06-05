const router = require('express').Router()
const Student = require('../schemas/Student')
const validator = require('email-validator')
const sendEmail = require('../utils/sendEmail.js')
const { hashPwd, verifyHashedPassword } = require('../utils/encryptPassword.js')
const { extractToken, verifyToken } = require('../middleware/jwt.js')
const signJwt = require('../utils/signJwt.js')
const verifyResetToken = require('../utils/verifyResetToken.js')

//Register student

router.post('/register', async (req, res) => {
  const { name, email_address, registration_number, password } = req.body

  if (!name || !email_address || !registration_number || !password) {
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

  try {
    //Check if email already in use
    const emailExists = await Student.findOne({
      email_address: email_address.toLowerCase()
    })
    if (emailExists) {
      return res.status(400).json({
        error: 'Email already in use',
        msg: 'Enter a different email address'
      })
    }

    //Check if registration number already in use
    const registrationNumberExists = await Student.findOne({
      registration_number: registration_number.toLowerCase()
    })
    if (registrationNumberExists) {
      return res.status(400).json({
        error: 'Registration number already in use',
        msg: 'Enter a different registrtion number'
      })
    }

    const hashedPwd = await hashPwd(password)

    const student = {
      name: name.toLowerCase(),
      registration_number: registration_number.toLowerCase(),
      email_address: email_address.toLowerCase(),
      password: hashedPwd
    }

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

    res.status(200).json({
      error: null,
      msg: 'Student registered successfully'
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      error: error.message,
      msg: 'Student registration unsuccessful'
    })
  }
})

//Login
router.post('/login', async (req, res) => {
  const { registration_number, password } = req.body

  if (!registration_number || !password) {
    return res.status(400).json({
      error: 'Some fields are empty',
      msg: 'All fields must be filled'
    })
  }

  try {
    //Check if registration number is registered
    const registrationNumberExists = await Student.findOne({
      registration_number: registration_number.toLowerCase()
    })
    if (!registrationNumberExists) {
      return res.status(400).json({
        error: 'Invalid login credentials',
        msg: 'Invalid login credentials'
      })
    }

    const isPwdVerified = await verifyHashedPassword(
      registrationNumberExists.password,
      password
    )

    if (!isPwdVerified) {
      return res.status(400).json({
        error: 'Invalid login credentials',
        msg: 'Invalid login credentials'
      })
    }

    const token = await signJwt(
      registrationNumberExists.name,
      registrationNumberExists.email_address,
      registrationNumberExists.registration_number
    )

    res.status(200).json({
      error: null,
      token: token,
      msg: 'Student logged in successfully'
    })
  } catch (error) {
    console.log(error)
    res.status(500).json({
      error: error,
      token: null,
      msg: 'Student login unsuccessful'
    })
  }
})

//Reset password if student is already logged in

router.post('/change_pwd', extractToken, verifyToken, async (req, res) => {
  const user = req.user
  const { newPassword } = req.body
  if (!newPassword) {
    return res.status(400).json({
      error: 'Password field is empty',
      msg: 'Password field must be filled'
    })
  }

  try {
    const student = await Student.findOne({
      email_address: user.email_address.toLowerCase()
    })

    if (!student) {
      return res.status(400).json({
        error: 'Student does not exist',
        msg: 'Student does not exist'
      })
    }

    const hashedPwd = await hashPwd(newPassword)

    await Student.findByIdAndUpdate(
      student._id,
      { password: hashedPwd },
      { new: true }
    )

    res.status(201).json({ error: null, msg: 'Password reset successful' })
  } catch (error) {
    res.status(401).json({ error: error, msg: 'Password reset unsuccessful' })
  }
})

//Reset password if student isn't logged in

router.post('/send_reset_pwd_link', async (req, res) => {
  const { email_address } = req.body
  if (!email_address) {
    return res.status(400).json({
      error: 'Email field is empty',
      msg: 'Email field must be filled'
    })
  } else if (!validator.validate(email_address)) {
    return res.status(400).json({
      error: 'Invalid email',
      msg: 'Enter a real email address'
    })
  }

  //Send email with password reset link
  try {
    const emailExists = await Student.findOne({
      email_address: email_address.toLowerCase()
    })
    if (!emailExists) {
      return res.status(400).json({
        error: 'Email does not exist',
        msg: 'Email does not exist'
      })
    }

    const token = await signJwt(
      emailExists.name,
      emailExists.email_address,
      emailExists.registration_number
    )

    const link = `http://192.168.70.59:5500/reset?token=${token}`

    await sendEmail(
      email_address,
      'Reset password',
      `Hello ${emailExists.name},`,
      `
  <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="background-color: #4CAF50; color: white; padding: 10px; text-align: center;">Reset Password</h2>
    <p>Hello <strong>${emailExists.name}</strong>,</p>
    <p>Use this link to reset your password:</p>
    <ul style="list-style: none; padding: 0;">
      <a href=${link}>Reset Password</a>
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
    res.status(200).json({
      error: null,
      msg: 'Password reset link sent successfully'
    })
  } catch (error) {
    console.error('Registration error:', error)
    res.status(500).json({
      error: error.message,
      msg: 'Student registration unsuccessful'
    })
  }
})

router.post('/reset_pwd', async (req, res) => {
  const { new_password, confirm_new_password, tokenString
  } = req.body

  if (!new_password || !confirm_new_password) {
    return res.status(400).json({
      error: 'Some fields are empty',
      msg: 'Fill in all the fields'
    })
  } else if (new_password !== confirm_new_password) {
    return res.status(400).json({
      error: 'Passwords do not match',
      msg: 'Both passwords must match'
    })
  }
  try {
    const isValid = await verifyResetToken(tokenString)
    if (!isValid.validity) {
      return res.status(400).json({
        error: 'Invalid token',
        msg: 'Token is invalid/Not present'
      })
    }

    const hashedPwd = await hashPwd(new_password)
    const decodedUser = isValid.user

    const student = await Student.findOne({
      email_address: decodedUser.email_address
    })
    if (!student) {
      res.status(400).json({
        error: 'Student cannot be found',
        msg: 'Student does not exist'
      })
    }

    await Student.findByIdAndUpdate(
      student._id,
      { password: hashedPwd },
      { new: true }
    )

    res.status(201).json({ error: null, msg: 'Password reset successful' })
  } catch (error) {
    res
      .status(400)
      .json({ error: error.msg, msg: 'Password reset unsuccessful' })
  }
})

module.exports = router
