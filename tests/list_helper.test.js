
const listHelper = require('../utils/list_helper')
const { blogs } = require('./test_helper')

describe('Total likes', () => {
  const singleBlogList = blogs.slice(0,1)
  test('Only one blog', () => {
    const result = listHelper.totalLikes(singleBlogList)
    expect(result).toBe(7)
  })
  test('Empty list', () => {
    const emptyList = blogs.slice(0,0)
    const result = listHelper.totalLikes(emptyList)
    expect(result).toBe(0)
  })

  test('All', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favoriteBlog', () => {
  test('Find favorite', () => {
    const fav = listHelper.favoriteBlog(blogs)
    expect(fav).toEqual(blogs[2])
  })
})

describe('mostBlogs', () => {
  test('Most blogs', () => {
    const most = listHelper.mostBlogs(blogs)
    const shouldbe = {
      author: 'Robert C. Martin',
      blogs: 3
    }
    expect(most).toEqual(shouldbe)
  })
})

describe('mostLikes', () => {
  test('Most blogs', () => {
    const most = listHelper.mostLikes(blogs)
    const shouldbe ={
      author: 'Edsger W. Dijkstra',
      likes: 17
    }
    expect(most).toEqual(shouldbe)
  })
})