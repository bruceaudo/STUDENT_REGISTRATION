const router = require('express').Router()
const Student = require('../schemas/Student')

router.get('/student', async (req, res) => {
  const query = req.query.q
  if (!query) {
    return res
      .status(400)
      .json({ error: 'Query is empty', msg: 'Query is empty' })
  }

  try {
    const student = await Student.findOne({ registration_number: query.toLowerCase() })
    res.status(200).json({ error: null, student: student })
  } catch (error) {
    res.status(400).json({ error: error, student: null })
  }
})

module.exports = router
