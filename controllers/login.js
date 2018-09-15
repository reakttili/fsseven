const loginRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  try {
    // Generates a token. Send back to brower
    let uName = request.body.username
    let password = request.body.password
    // User exists?
    const user = await User.findOne({ username: uName })
    console.log("User exists?")
    console.log(user)
    // Password correct?
    const bCorrectPassword = await bcrypt.compare(password,user.passwordHash)
    let bInvalideUserNameOrPassword = false
    if (user === null || bCorrectPassword === false) {
      bInvalideUserNameOrPassword = true
    }
    if (bInvalideUserNameOrPassword) {
      return response.status(401).json( { error: 'Invalid username or password' } )
    }
    const userForToken = {
      username: user.username,
      id: user._id
    }
    // Username and password ok
    // Generate a token to browser to save
    const token = jwt.sign(userForToken, process.env.SECRET)
    response.status(200).send({ token, username: user.username, name: user.name })
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Error' })}
})

module.exports = loginRouter