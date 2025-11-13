import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  initializeBlog,
  fetchFeedBlogs, // 👈 import personalized feed action
} from '../reducers/blogreducer'
import {
  Box,
  Typography,
  Container,
  CircularProgress,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material'
import BlogCard from './BlogCard'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { items: blogs } = useSelector((state) => state.blogs)
  const [view, setView] = useState('all') // all | feed

  // 🧠 Fetch blogs based on selected view
  useEffect(() => {
    if (view === 'all') {
      dispatch(initializeBlog())
    } else {
      dispatch(fetchFeedBlogs())
    }
  }, [dispatch, view])

  const handleChange = (_, newView) => {
    if (newView) setView(newView)
  }

  // 🕒 Loading / Empty State
  if (!blogs) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '70vh',
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading blogs...
        </Typography>
      </Box>
    )
  }

  // 📭 Handle empty feed
  if (blogs.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 6 }}>
        <Typography
          variant="h3"
          align="center"
          sx={{
            mb: 4,
            fontWeight: 700,
            letterSpacing: '-0.5px',
            color: '#1a202c',
          }}
        >
          {view === 'feed' ? 'Your Feed' : 'All Blogs'}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
          <ToggleButtonGroup
            value={view}
            exclusive
            onChange={handleChange}
            color="primary"
          >
            <ToggleButton value="all">All</ToggleButton>
            <ToggleButton value="feed">My Feed</ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Typography
          align="center"
          variant="body1"
          color="text.secondary"
          sx={{ mt: 4 }}
        >
          {view === 'feed'
            ? "You don't follow anyone yet — start following authors to build your feed!"
            : 'No blogs found yet. Be the first to share something!'}
        </Typography>
      </Container>
    )
  }

  // ✅ Render Blogs
  return (
    <Container maxWidth="xl" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          mb: 6,
          fontWeight: 700,
          letterSpacing: '-0.5px',
          color: '#1a202c',
        }}
      >
        {view === 'feed' ? 'Your Feed' : 'All Blogs'}
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 4 }}>
        <ToggleButtonGroup
          value={view}
          exclusive
          onChange={handleChange}
          color="primary"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="feed">My Feed</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* ✅ Uniform Responsive Grid Layout */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '2rem',
          alignItems: 'stretch',
        }}
      >
        {blogs.map((blog) => (
          <BlogCard key={blog.id || blog._id} blog={blog} />
        ))}
      </Box>
    </Container>
  )
}

export default Dashboard
