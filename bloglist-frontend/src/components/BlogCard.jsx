// src/components/BlogCard.jsx
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Chip,
  Stack,
  Box,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'

const BlogCard = ({ blog }) => {
  const navigate = useNavigate()

  // Fallbacks to avoid runtime errors
  const title = blog?.title || 'Untitled Post'
  const author = blog?.user?.name || blog?.author || 'Unknown Author'
  const tags = blog?.tags || []
  const imageUrl = blog?.imageUrl
    ? `http://localhost:3003/${blog.imageUrl.replace(/\\/g, '/')}`
    : '/default-blog.png'

  return (
    <Card
      onClick={() => navigate(`/blogs/${blog.id}`)}
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        transition: 'transform 0.2s ease',
        cursor: 'pointer',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 },
      }}
    >
      {/* --- Image --- */}
      <CardMedia
        component="img"
        image={imageUrl}
        alt={title}
        sx={{
          width: '100%',
          aspectRatio: '16/9',
          objectFit: 'cover',
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      />

      {/* --- Content --- */}
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            fontSize: '1rem',
            mb: 1,
            color: '#111827',
            lineHeight: 1.3,
          }}
        >
          {title.length > 40 ? `${title.slice(0, 40)}...` : title}
        </Typography>

        <Typography
          variant="body2"
          sx={{ color: '#6b7280', mb: 2, fontWeight: 500 }}
        >
          by {author}
        </Typography>

        {tags?.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap' }}>
            {tags.map((tag, index) => (
              <Chip
                key={`${tag}-${index}`}
                label={`#${tag}`}
                size="small"
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`/tags/${tag}`)
                }}
                sx={{
                  cursor: 'pointer',
                  fontWeight: 500,
                  textTransform: 'lowercase',
                  bgcolor: '#f3f4f6',
                  '&:hover': { bgcolor: '#e5e7eb' },
                }}
              />
            ))}
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}

export default BlogCard
