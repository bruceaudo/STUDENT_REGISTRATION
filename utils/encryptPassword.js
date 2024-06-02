const argon2 = require('argon2');

const hashPwd = async password => {
  try {
      const hash = await argon2.hash(password)
      return hash
  } catch (err) {
    console.error(`Error:${err}`)
  }
}

const verifyHashedPassword = async (hashedPwd, pwd) => {
  try {
    if (await argon2.verify(hashedPwd, pwd)) {
      return true
    } else {
      return false
    }
  } catch (err) {
    console.error(`Error: ${err}`)
  }
}

module.exports = { hashPwd, verifyHashedPassword };
