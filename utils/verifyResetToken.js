const jwt = require('jsonwebtoken')

const verifyResetToken = async token => {
  return new Promise((resolve, reject) => {
    if (!token) {
      reject({
        error: 'Token is an empty string',
        validity: false,
        user: null
      })
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject({
          error: 'Invalid token',
          validity: false,
          user: null
        })
      }

      resolve({
        error: 'Token is valid',
        validity: true,
        user: decoded
      })
    })
  })
}

module.exports = verifyResetToken
