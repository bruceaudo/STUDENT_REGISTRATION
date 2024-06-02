const nodemailer = require('nodemailer')

// Create a transporter object using Gmail SMTP
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER, // Your Gmail address
    pass: process.env.GMAIL_PASS // Your Gmail password or App Password
  }
})

/**
 * Send an email
 * @param {string} to - The recipient's email address
 * @param {string} subject - The email subject
 * @param {string} text - The plain text body
 * @param {string} html - The HTML body
 */
const sendEmail = async (to, subject, text, html) => {
  try {
    let info = await transporter.sendMail({
      from: `<${process.env.GMAIL_USER}>`, // Sender address
      to: to, // List of receivers
      subject: subject, // Subject line
      text: text, // Plain text body
      html: html // HTML body
    })
    console.log('Email sent: %s', info.messageId)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

module.exports = sendEmail
