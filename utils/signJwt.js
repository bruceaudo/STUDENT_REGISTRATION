const jwt = require('jsonwebtoken')

const signJwt = async (name, email_address, registration_number) => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      {
        name: name,
        email_address: email_address,
        registration_number: registration_number
      },
      process.env.JWT_SECRET,
      { expiresIn: 1200 },
      (err, token) => {
        if (err) {
          reject(err)
        } else {
          resolve(token)
        }
      }
    )
  })
}


module.exports = signJwt
