// src/components/TagPage.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { fetchBlogsByTag } from '../reducers/blogreducer'
import { Container, Typography, Box, CircularProgress } from '@mui/material'
import BlogCard from './BlogCard'

const TagPage = () => {
  const { tag } = useParams()
  const dispatch = useDispatch()
  const { items: blogs, loading } = useSelector((state) => state.blogs)

  useEffect(() => {
    dispatch(fetchBlogsByTag(tag))
  }, [dispatch, tag])

  // 🌀 Loading State
  if (loading) {
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
          Loading posts...
        </Typography>
      </Box>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h3"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 6,
          textTransform: 'capitalize',
          letterSpacing: '-0.5px',
          color: '#1a202c',
        }}
      >
        Posts tagged with “{tag}”
      </Typography>

      {!blogs || blogs.length === 0 ? (
        <Typography align="center" color="text.secondary" sx={{ mt: 10 }}>
          No blogs found for this tag.
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2rem',
            alignItems: 'stretch',
          }}
        >
          {blogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </Box>
      )}
    </Container>
  )
}

export default TagPage
