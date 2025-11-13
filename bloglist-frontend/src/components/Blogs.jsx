// src/components/Blogs.jsx (or wherever this component lives)

import { useSelector } from 'react-redux'
import BlogCard from './BlogCard'
import { Grid, Typography } from '@mui/material' // Added Typography for a title

const Blogs = () => {
  const blogs = useSelector((state) => state.blogs.items)

  // Best Practice: Handle the case where there are no blogs to display.
  if (!blogs || blogs.length === 0) {
    return <Typography>No blog posts found.</Typography>
  }

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Typography
        variant="h4"
        align="center"
        sx={{ fontWeight: 700, mb: 6, color: '#1f2937' }}
      >
        All Blogs
      </Typography>

      <Grid
        container
        spacing={4}
        justifyContent="center"
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2rem',
        }}
      >
        {blogs.map((blog) => (
          <BlogCard key={blog.id} blog={blog} />
        ))}
      </Grid>
    </Container>
  )
}

export default Blogs
