import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [newBlog, setNewBlog] = useState('')

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)


  useEffect(() => {
    if (user) {
      blogService.getAll().then(blogs =>
        setBlogs( blogs ) )
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleBlogChange = (event) => {
    setNewBlog(event.target.value)
  }



  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setMessage('Login successful')
      setMessageType('success')

      setTimeout(() => {
        setMessage(null)
      }, 5000)

      setUsername('')
      setPassword('')
    }
    catch (error) {
      setMessage('wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setMessage(null)
      }, 5000)
    }
  }

  const loginForm = () => (
    <form onSubmit={handleLogin}>
      <div>
        username
        <input
          type="text"
          data-testid='username'
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        password
        <input
          type="password"
          data-testid='password'
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <button type="submit">login</button>
    </form>
  )

  const sortedBlogs = blogs.sort((a, b) => b.likes - a.likes)

  const deleteBlog = (id) => {
    setBlogs(blogs.filter(blog => blog.id !== id))
  }
  return (
    <div>
      <h1>Blogs</h1>
      <Notification message={message} type={messageType} />

      {!user && loginForm()}
      {user &&  <div>
        <p>{user.name} logged in <button onClick={() => window.localStorage.removeItem('loggedBlogappUser')}>log out</button></p>
        <BlogForm blogs={blogs} setBlogs={setBlogs}/>
      </div>
      }

      <div>
        <h2>Blogs</h2>
        {sortedBlogs.map(blog => (
          <Blog key={blog.id} blog={blog} updateBlog={updatedBlog =>
            setBlogs(blogs.map(b => b.id === updatedBlog.id ? updatedBlog : b))}
          deleteBlog={deleteBlog}
          loggedInUser={user}
          />
        ))}
      </div>
    </div>
  )
}

export default App