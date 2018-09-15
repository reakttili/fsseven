const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const blogRouter = require('./controllers/blog')
const userRouter = require('./controllers/user')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

mongoose.connect(config.mongoUrl)


app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

// app.listen(config.port, () => {
//   console.log(`Server running on port ${config.port}`)
// })

const server = http.createServer(app)
server.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`)
})
server.on('close', () => {
  mongoose.connection.close()
})

module.exports = {
  app, server
}