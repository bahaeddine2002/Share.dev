import { createSlice } from '@reduxjs/toolkit'
import blogService from '../services/blogs'

const initialState = {
  items: [],
  totalPages: 1,
  currentPage: 1,
}

const blogSlice = createSlice({
  name: 'blogs',
  initialState: initialState,
  reducers: {
    appendBlog(state, action) {
      state.items.push(action.payload)
    },
    setBlogs(state, action) {
      if (Array.isArray(action.payload)) {
        state.items = action.payload
        state.totalPages = 1
        state.currentPage = 1
      } else {
        // If payload is paginated (trending)
        state.items = action.payload.blogs
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      }
    },
    updateBlogInList(state, action) {
      const updatedBlog = action.payload
      state.items = state.items.map((blog) =>
        blog.id !== updatedBlog.id ? blog : updatedBlog
      )
    },
    removeBlogFromList(state, action) {
      const idToRemove = action.payload
      state.items = state.items.filter((blog) => blog.id !== idToRemove)
    },
  },
})

export const {
  setBlogs,
  appendBlog,
  updateBlogInList,
  removeBlogFromList,
  updateUserFollow,
} = blogSlice.actions

export const initializeBlog = (page = 1) => {
  return async (dispatch) => {
    const data = await blogService.getAll()
    dispatch(setBlogs(data))
  }
}

export const createBlog = (blogObj) => {
  return async (dispatch) => {
    try {
      // ✅ Prepare multipart form data
      const formData = new FormData()
      formData.append('title', blogObj.title)
      formData.append('author', blogObj.author)
      formData.append('url', blogObj.url)

      // ✅ Convert tags array into comma-separated string for backend
      if (blogObj.tags && blogObj.tags.length > 0) {
        formData.append('tags', blogObj.tags.join(','))
      }

      // ✅ Attach image if exists
      if (blogObj.image) {
        formData.append('image', blogObj.image)
      }

      // ✅ Send to backend via service
      const createdBlog = await blogService.create(formData)

      // ✅ Update state
      dispatch(appendBlog(createdBlog))
      return createdBlog
    } catch (error) {
      console.error('Error creating blog:', error)
      throw error
    }
  }
}

export const addComment = (obj, id) => {
  return async (dispatch) => {
    const updatedBlogWithComment = await blogService.createComment(obj, id)

    dispatch(updateBlogInList(updatedBlogWithComment))
  }
}

export const updateBlog = (updatedBlogObject) => {
  return async (dispatch) => {
    const returnedBlog = await blogService.update(
      updatedBlogObject,
      updatedBlogObject.id
    )
    dispatch(updateBlogInList(returnedBlog))
  }
}

export const deleteBlog = (id) => {
  return async (dispatch) => {
    await blogService.del(id)
    dispatch(removeBlogFromList(id))
  }
}

export const likeBlog = (blogObject) => {
  return async (dispatch) => {
    try {
      const updatedBlog = await blogService.like(blogObject.id)
      dispatch(updateBlogInList(updatedBlog))
      console.log(updateBlog)
    } catch (error) {
      console.error('Failed to like the blog:', error)
      dispatch(setNotifiction('An error occurred while liking the post.'))
    }
  }
}

export const fetchBlogsByTag = (tag) => {
  return async (dispatch) => {
    try {
      const data = await blogService.getByTag(tag)
      dispatch(setBlogs(data))
    } catch (error) {
      console.error('Failed to fetch blogs by tag:', error)
    }
  }
}

export const fetchFeedBlogs = () => {
  return async (dispatch) => {
    try {
      const res = await blogService.getFeed()
      dispatch(setBlogs(res))
    } catch (error) {
      console.error('Failed to fetch feed:', error)
    }
  }
}

export default blogSlice.reducer
