import { useState, useEffect } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, updateBlog, loggedInUser, deleteBlog }) => {
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const expandedBlogId = localStorage.getItem('expandedBlogId')
    if (expandedBlogId === blog.id) {
      setShowAll(true)
      localStorage.removeItem('expandedBlogId')
    }
  }, [blog.id])

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleAll = () => {
    setShowAll(!showAll)
  }

  const handleLike = async () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }

    try {
      const returnedBlog = await blogService.update(blog.id, updatedBlog)
      updateBlog(returnedBlog)
      localStorage.setItem('expandedBlogId', blog.id)
      window.location.reload()
      setShowAll(true)

    } catch (error) {
      console.error('Error liking the blog:', error)
    }
  }

  const handleDelete = async () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}?`)) {
      try {
        await blogService.remove(blog.id)
        deleteBlog(blog.id)
      } catch (error) {
        console.error('Error deleting the blog:', error)
      }
    }
  }

  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleAll}>
          {showAll ? 'hide' : 'view'}
        </button>
      </div>
      {showAll && (
        <div>
          <div>{blog.url}</div>
          <div data-testid="like-count">likes {blog.likes} <button onClick={handleLike} >like</button></div>
          <div>added by {blog.user.name}</div>
          <div>{loggedInUser?.username === blog.user?.username && (
            <button onClick={handleDelete}>delete</button>
          )}</div>
        </div>
      )}
    </div>
  )
}

export default Blog