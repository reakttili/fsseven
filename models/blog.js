const mongoose = require('mongoose')
Schema = mongoose.Schema
ObjectId = Schema.ObjectId

const BlogSchema = new Schema ({
  title: String,
  author: String,
  url: String,
  likes: Number,
  comments: [],
  user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})
// assign a function to the "statics" object of our animalSchema
BlogSchema.statics.formatBlog = function(blog) {
  return {
    id: blog._id,
    title: blog.title,
    author: blog.author,
    url: blog.url,
    likes: blog.likes,
    comments: blog.comments,
    user: blog.user
    
  }}
const Blog = mongoose.model('Blog', BlogSchema)

module.exports = Blog