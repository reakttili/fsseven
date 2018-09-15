const blogRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const Blog = require('./../models/blog')
const User = require('./../models/user')

blogRouter.get('/', async (request, response) => {
  let blogs = await Blog
    .find({})
    .populate("user", { name: 1, username: 1 })
  response.json(blogs.map(Blog.formatBlog))

  // Blog
  //   .find({})
  //   .then(blogs => {
  //     response.json(blogs)
  //   })
})

blogRouter.put('/:id', async (request, response) => {
  try {
    try {
      const b = await Blog.findById(request.params.id)
      const tokenString = request.token//request.headers.authorization.slice(7,)
      let decodedToken = jwt.verify(tokenString, process.env.SECRET)
      if (!b.user.toString()===decodedToken.id) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
      console.log(request.body)
    } catch (exception) {
      console.log(exception)
      return response.status(401).json({ error: 'token missing or invalid' })
    }

    // Todo: implement so that change in schema doesn't matter!
    const updatedBlog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: request.body.user
    }
    const upBlog = await Blog
      .findByIdAndUpdate(request.params.id, updatedBlog, { new: true } )
      .populate('user', { name: 1, username: 1 })
    console.log('upBlog', upBlog)
    response.json(Blog.formatBlog(upBlog))
  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'malformatted id' })
  }
})

blogRouter.delete('/:id', async (request, response) => {
  console.log('@DELETE')
  try {
    // Get note to be deleted from database
    const b = await Blog.findById(request.params.id)
    if (b.user) {
      try {
        const decodedToken = jwt.verify(request.token, process.env.SECRET)
        console.log('user to string:',b.user.toString())
        console.log('decoded token:',decodedToken.id)
        if (!b.user.toString()===decodedToken.id) {
          return response.status(401).json({ error: 'token missing or invalid' })
        }
      } catch (exception) {
        return response.status(401).json({ error: 'token missing or invalid' })
      }
    }
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (exception) {
    console.log(exception)
    response.status(400).json({ error: 'malformatted id' })
  }
})

//api/blogs/:id/comments tapahtuva HTTP POST -

blogRouter.post('/:id/comments', async (request, response) => {
  console.log('comment part')
  try {
    const b = await Blog.findById(request.params.id)
    const updatedBlog = {
      title: request.body.title,
      author: request.body.author,
      url: request.body.url,
      likes: request.body.likes,
      user: request.body.user,
      comments: request.body.comments
    }
    console.log("updater", updatedBlog)
    console.log("updater", request.body)

    const upBlog = await Blog
      .findByIdAndUpdate(request.params.id, updatedBlog, { new: true } )
      .populate('user', { name: 1, username: 1 })
    response.json(Blog.formatBlog(upBlog))
  } catch (exception) {
    console.log(exception)
  }
})

blogRouter.post('/', async (request, response) => {
  try {
    // Model way was:
    // const authorization = request.get('authorization') 
    // if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    // if (!token || !decodedToken.id) {
    //   return response.status(401).json({ error: 'token missing or invalid' })
    //  }
    let decodedToken = null
    try {
      const tokenString = request.token//request.headers.authorization.slice(7,)
      decodedToken = jwt.verify(tokenString, process.env.SECRET)
    } catch (exception) {
      console.log(exception)
      return response.status(401).json({ error: 'token missing or invalid' })
    }
    const blog = new Blog(request.body)
    //console.log("D-token", decodedToken)
    //console.log("IDfrom",decodedToken.id)
    const users = await User.find({})
    //console.log(users)
    const user = await User.findOne({ _id: decodedToken.id })
    //console.log(user)
    blog.user = user._id
    if (!blog.likes) {
      blog.likes = 0
    }
    if (!blog.url || !blog.title) {
      return response.status(400).json({ error: 'content missing' })
    }
    let saved = await blog.save()
    console.log('saved blog?2', saved)
    user.blogs = user.blogs.concat(saved._id)
    await user.save()

    const b = await Blog
      .findById(saved.id)
      .populate('user', { name: 1, username: 1 })
    console.log('saved blog?3',b)

    return response.status(201).json(Blog.formatBlog(b))
  } catch (exception) {
    console.log(exception)
  }
})

module.exports = blogRouter