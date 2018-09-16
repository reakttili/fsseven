if (process.env.NODE_ENV !== 'production') {
  //console.log("Not production!")
  require('dotenv').config()
}

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI


if (process.env.NODE_ENV === 'test') {
  port = process.env.TEST_PORT
  mongoUrl = process.env.TEST_MONGODB_URI
}

console.log('Port', port)
console.log('mongoUrl', mongoUrl)
console.log('nodeenv:')
console.log(process.env.NODE_ENV)

module.exports = {
  mongoUrl,
  port
}