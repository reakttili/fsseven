const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')
const { blogs,blogsInDb, usersInDb } = require('./test_helper')

//npx jest -t 'Test postin'
//https://jestjs.io/docs/en/expect
// toContain
// toCotainEqual
// beforeEach vs beforeAll

describe('when there is initially some blogs saved', async () => {
  beforeEach(async () => {
    const initialBlogs = blogs
    await Blog.remove({})
    
    const noteObjects = initialBlogs.map(b => new Blog(b))
    await Promise.all(noteObjects.map(b => b.save()))
    await User.remove( { _id : { $ne: '5b70608e283a1e2bfc077e8c' } } )
  })

  test('notes are returned as json', async () => {
    const initialBlogs = blogs
    const response = await api
      .get('/api/blogs')
      .expect(200) 
      .expect('Content-Type', /application\/json/)
    expect(response.body.length).toBe(initialBlogs.length)
    const returnedContents = response.body.map(n => n.content)
    initialBlogs.forEach(note => {
      //console.log(note)
      expect(returnedContents).toContain(note.content)
    })
  })
  test('Basic post test', async () => {

    const newUser = {
      username: 'VB',
      name: 'Ville',
      password: 'salis'
      //passwordHash: String,
      //adult: Boolean,
      //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
    }
    await api.post('/api/users').send(newUser) // Test user

    let blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'FPGA',
      author: 'Young Chan',
      url: 'https://fpga.com/',
      likes: 3
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
      .send(newBlog)  //Note: send function!
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await blogsInDb()
    expect(response.body.title).toEqual(newBlog.title)
    expect(blogsAfterPost.length).toBe(blogsAtStart.length + 1)
  })
  test('Likes missing', async () => {
    const newUser = {
      username: 'VB',
      name: 'Ville',
      password: 'salis'
      //passwordHash: String,
      //adult: Boolean,
      //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
    }
    await api.post('/api/users').send(newUser) // Test user

    let blogsAtStart = await blogsInDb()
    const newBlog = {
      title: 'FPGA',
      author: 'Young Chan',
      url: 'https://fpga.com/',
    }
    const response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
      .send(newBlog)  //Note: send function!
      .expect(201)
      .expect('Content-Type', /application\/json/)
    const blogsAfterPost = await blogsInDb()
    const newblog = await blogsAfterPost.find(blog => blog.title==='FPGA')
    //console.log(newblog)
    expect(newblog.likes).toEqual(0)
  })
  test('Bad request post', async () => {
    const newUser = {
      username: 'VB',
      name: 'Ville',
      password: 'salis'
      //passwordHash: String,
      //adult: Boolean,
      //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
    }
    await api.post('/api/users').send(newUser) // Test user

    // Note: three separate tests should be done, but hope it is not necassary?
    let blogsAtStart = await blogsInDb()
    let newBlog = {
      //title: 'FPGA',
      author: 'Young Chan',
      //url: 'https://fpga.com/',
      likes: 5
    }
    let response = await api
      .post('/api/blogs')
      .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
      .send(newBlog)  //Note: send function!
      .expect(400)    // Bad request 
      .expect('Content-Type', /application\/json/)
    let blogsAfterPost = await blogsInDb()
  })
 
  // Front end testaus
  // tarvitaan jest
  // Air bnb on kehittäny: npm install --save-dev enzyme enzyme-adapter-react-16

  // Note: old test
  // test('Delete test', async () => {
  //   let blogsAtStart = await blogsInDb()
  //   let response = await api
  //     .delete('/api/blogs/5a422bc61b54a676234d17fc')
  //     .expect(204)
  //   let blogsAfterDelete = await blogsInDb()
  //   expect(blogsAfterDelete).not.toContainEqual(blogsAtStart[6]) // Not  good way. Change so that others test have no effect
  // })

  test('Update test', async () => {
    let blogsAtStart = await blogsInDb()
    const blogToUpdate = blogsAtStart.find(blog => { return blog.title === 'React patterns'} )
    blogToUpdate.likes = 24
    let response = await api
      .put('/api/blogs/5a422a851b54a676234d17f7')
      .send(blogToUpdate)
    let blogsAfter = await blogsInDb()
    const updated = blogsAfter.find(blog => { return blog.title === 'React patterns'} )
    expect(updated.likes).toEqual(24)
  })

  // Laajenna käyttäjätunnusten luomista siten, että salasanan tulee olla vähintään 3 
  // merkkiä pitkä ja käyttäjätunnus on järjestelmässä uniikki. 
  // Jos täysi-ikäisyydelle ei määritellä luotaessa arvoa, on se oletusarvoisesti true.
  // Luomisoperaation tulee palauttaa sopiva statuskoodi ja kuvaava virheilmoitus, 
  // jos yritetään luoda epävalidi käyttäjä.
  // Tee testit, jotka varmistavat, että virheellisiä käyttäjiä ei luoda, 
  // ja että virheellisen käyttäjän luomisoperaatioon vastaus on järkevä 
  // statuskoodin ja virheilmoituksen osalta.
  describe('User tests', async () => {
    test('Normal Add', async () => {
      //let blogsAtStart = await usersInDb()

      const newUser = {
        username: 'VBB',
        name: 'Ville',
        password: 'salis'
        //passwordHash: String,
        //adult: Boolean,
        //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
      }
      const response = await api
        .post('/api/users')
        .send(newUser)  //Note: send function!
        .expect(200)
        .expect('Content-Type', /application\/json/)
      const usersAfterPost = await usersInDb()
      //console.log(usersAfterPost)
      //expect(response.body.title).toEqual(newBlog.title)
      //expect(blogsAfterPost.length).toBe(blogsAtStart.length + 1)
    })

    test('Existing', async () => {
      //let blogsAtStart = await usersInDb()

      const newUser = {
        username: 'VB',
        name: 'Ville',
        password: 'salis'
        //passwordHash: String,
        //adult: Boolean,
        //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
      }
      let response = await api.post('/api/users').send(newUser)  
      response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      expect(response.body.error).toEqual('Username exists')
      const users = await User.find({})
      expect(users.length).toEqual(1) // One added
    })
    test('Too short password', async () => {
      //let blogsAtStart = await usersInDb()

      const newUser = {
        username: 'VB',
        name: 'Ville',
        password: 'ss'
        //passwordHash: String,
        //adult: Boolean,
        //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
      }
      let response = await api.post('/api/users').send(newUser)  
      response = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
      expect(response.body.error).toEqual('Too short password')
      const users = await User.find({})
      expect(users.length).toEqual(1)
    })

    test('Add blog with user', async () => {
      //let blogsAtStart = await usersInDb()

      const newUser = {
        username: 'VB',
        name: 'Ville',
        password: 'sss'
        //passwordHash: String,
        //adult: Boolean,
        //notes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog' }]
      }
      await api.post('/api/users').send(newUser)
      let users = await usersInDb()
      let newBlog = {
        title: 'FPGA',
        author: 'Young Chan',
        url: 'https://fpga.com/',
        likes: 5
      }
      let response = await api
        .post('/api/blogs')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
        .send(newBlog)  //Note: send function!
        .expect(201)
      let blogsAfterPost = await blogsInDb()

      // One blog should be printed correctly with user:
      response = await api
        .get('/api/users')
        .expect(200) 
        .expect('Content-Type', /application\/json/)
      //console.log(response.text)

      // User can be seen with blog
      response = await api
        .get('/api/blogs')
        .expect(200) 
        .expect('Content-Type', /application\/json/)
      //console.log(response.text)
 
    })

    test('Login test', async () => {
      let newBlog = {
        title: 'FPGA2',
        author: 'Young Chan2',
        url: 'https://fpga.com/2',
        likes: 5
      }
      response = await api
        .post('/api/blogs')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
        .send(newBlog)
        .expect(201)
      console.log(response.body)
    })

    test('Delete test II', async () => {
      let newBlog = {
        title: 'FPGA2',
        author: 'Young Chan2',
        url: 'https://fpga.com/2',
        likes: 5
      }
      let response = await api
        .post('/api/blogs')
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
        .send(newBlog)
        .expect(201)
      let id = response.body.id
      console.log('ID TO REMOVE', id)
      // With wrong auth delete should not owrk
      response = await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', 'bearer ayJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
        .expect(401)

      // Now delete should work
      response = await api
        .delete(`/api/blogs/${id}`)
        .set('Authorization', 'bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6IlZCIiwiaWQiOiI1YjcwNjA4ZTI4M2ExZTJiZmMwNzdlOGMiLCJpYXQiOjE1MzQwOTE3MTF9.viUydTOl4vgfvWYEHbxyS0Yerblk35C9EQFbHWOw91M')
        .expect(204)
    })

  })
  afterAll(() => {
    console.log('Close the server.')
    server.close()
  })

})