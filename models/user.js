const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username: String,
  name: String,
  passwordHash: String,
  adult: Boolean,
  blogs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
})

userSchema.statics.formatUser = (user) => {
  return {
    id: user._id,
    username: user.username,
    name: user.name,
    blogs: user.blogs,
    adult: user.adult
  }
}

const User = mongoose.model('User', userSchema)

module.exports = User