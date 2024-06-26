const express = require('express')
const cors = require('cors')
const path = require('node:path')
require('dotenv').config()
const connectToMongoDB = require('./database/mongoDB.js').connectToMongoDB
const studentRoute = require('./routes/student.routes.js')
const searchRoute = require('./routes/search.routes.js')
const cors_options = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE']
}
const port = process.env.PORT || 6500
const uri = process.env.MONGO
connectToMongoDB(uri)

const app = express()
app.use(express.json())
app.use(cors(cors_options))
app.use(express.urlencoded({ extended: true }))

app.use(express.static(path.join(__dirname, 'public')))

app.get('/reset', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

app.use('/api/v1/student', studentRoute)
app.use('/api/v1/search', searchRoute)

app.listen(port, () => console.log(`Server is listening on port ${port}`))
