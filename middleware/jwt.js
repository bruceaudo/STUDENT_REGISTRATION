const jwt = require('jsonwebtoken')

const extractToken = (req, res, next) =>
{
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing' });
  }

  req.token = token; 
  next();
};

const verifyToken = (req, res, next) => {
  const token = req.token
  if (!token) {
    return res.status(401).json({ error: 'Token not provided' })
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: 'Invalid token' })
    }

    req.user = decoded
    next()
  })
}

module.exports = { extractToken, verifyToken };