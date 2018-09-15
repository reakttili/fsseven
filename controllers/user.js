const mongoose = require('mongoose')
const userRouter = require('express').Router()
const User = require('./../models/user')
const Blog = require('./../models/blog')
const bcrypt = require('bcrypt')

userRouter.post('/', async (request, response) => {
  try {
    const saltRounds = 7
    const password = request.body.password
    if (password.length < 3) {
      return response.status(400).json({ error: 'Too short password' })
    }
    const users = await User.find({ username: request.body.username })
    if (users.length > 0) {
      return response.status(400).json({ error: 'Username exists' })
    }
    let bIsAdult = false
    if (!request.body.adult) {
      bIsAdult = true
    } else {
      bIsAdult = response.boy.adult
    }
    const passwordHash = await bcrypt.hash(password,saltRounds)
    const user = new User({
      username: request.body.username,
      name: request.body.name,
      passwordHash,
      adult: bIsAdult
    })
    const savedUser = await user.save()
    response.json(User.formatUser(savedUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Error' })
  }
})

userRouter.get('/', async (request, response) => {
  try {
    const users = await User
      .find({})
      .populate('blogs',{ likes: 1, author: 1, title:1, url: 1 })
    response.json(users.map(User.formatUser))
  } catch (exception) {
    console.log(exception)
    response.status(500).json({ error: 'Error' })
  }
})

module.exports = userRouter