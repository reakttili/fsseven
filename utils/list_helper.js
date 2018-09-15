const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  let sum = 0
  if (blogs.length===0) {
    return 0
  }
  sum = blogs.reduce((s,element) => {return element.likes+s},0)
  return sum
}

const favoriteBlog = (blogs) => {
  let favourite
  let maxLikes = 0
  blogs.forEach(element => {
    if (maxLikes < element.likes)
    {
      favourite = element
      maxLikes = element.likes
    }
  })
  return favourite

}

const mostBlogs = (blogs) => {
  // let allAuthors = blogs.map(blog => blog.author)
  // let uniqueAuthours = allAuthors.filter((author, index) => {
  //   return allAuthors.indexOf(author) === index
  // })

  let dict = {}
  blogs.forEach(blog => {
    if (!dict[blog.author]) {
      dict[blog.author] = 1
    } else {
      dict[blog.author] +=1
    }
  })

  let currentMax = 0
  let currentAuthor
  Object.keys(dict).forEach((key) => {
    if (dict[key] > currentMax) {
      currentAuthor = key
      currentMax = dict[key]
    }
  })
  return { 'author':currentAuthor, 'blogs': dict[currentAuthor] }
}

const mostLikes = (blogs) => {
  let dict = {}
  blogs.forEach(blog => {
    if (!dict[blog.author]) {
      dict[blog.author] = blog.likes
    } else {
      dict[blog.author] +=blog.likes
    }
  })

  let currentMax = 0
  let currentAuthor
  Object.keys(dict).forEach((key) => {
    if (dict[key] > currentMax) {
      currentAuthor = key
      currentMax = dict[key]
    }
  })
  return { 'author':currentAuthor, 'likes': dict[currentAuthor] }
}

module.exports = {
  dummy, totalLikes, favoriteBlog, mostBlogs, mostLikes
}