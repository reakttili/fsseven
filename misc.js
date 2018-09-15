const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
require('dotenv').config()

const test = async () => {
  const password = "salis"
  const passwordHash = await bcrypt.hash(password,7)
  console.log(passwordHash)
}

test()

const userForToken = {
  username: 'BV',
  id: '5b76dda250834b29d8e8297e'
}
console.log("AT LOGIN, userForTOken", userForToken)
// Username and password ok
// Generate a token to browser to save
const token = jwt.sign(userForToken, process.env.SECRET)
console.log(token)

let tokenString = "bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNWQ1YmJhYjcxOTM4ZjQ4ZWUwNGQiLCJpYXQiOjE1MzQwOTEyOTZ9.s4OGQSXUDh8cLYsLyG5YnTMDfzcTAJ4y-3_vZIHMAho"
tokenString = tokenString.slice(7,)
//console.log(tokenString)
const decodedToken = jwt.verify(tokenString, process.env.SECRET)
console.log(decodedToken)