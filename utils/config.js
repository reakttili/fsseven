if (process.env.NODE_ENV !== 'production') {
  //console.log("Not production!")
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI
console.log('Port', port)
console.log('mongoUrl', mongoUrl)
if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGODB_URI
}

module.exports = {
  mongoUrl,
  port
}