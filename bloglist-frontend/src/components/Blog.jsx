import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { deleteBlog, addComment, likeBlog } from '../reducers/blogreducer'
import { useState } from 'react'
import {
  Box,
  Typography,
  Paper,
  Stack,
  Divider,
  TextField,
  Button,
  Container,
  CardMedia,
  Avatar,
  Chip,
  IconButton,
  Link,
} from '@mui/material'
import FavoriteIcon from '@mui/icons-material/Favorite'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import DeleteIcon from '@mui/icons-material/Delete'

const Blog = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const blog = useSelector((state) =>
    state.blogs.items.find((b) => b.id === id)
  )
  const user = useSelector((state) => state.user)
  const [comment, setComment] = useState('')

  if (!blog) {
    return (
      <Typography align="center" sx={{ mt: 10 }}>
        Loading blog...
      </Typography>
    )
  }

  const handleLike = () => dispatch(likeBlog(blog))

  const handleDelete = () => {
    if (window.confirm(`Delete "${blog.title}"?`)) {
      dispatch(deleteBlog(blog.id))
      navigate('/')
    }
  }

  const handleComment = (e) => {
    e.preventDefault()
    if (comment.trim() === '') return
    dispatch(addComment({ content: comment }, id))
    setComment('')
  }

  const userHasLiked = blog.likes.some(
    (liker) => (liker.id || liker) === user.id
  )

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        sx={{
          p: { xs: 2, sm: 5 },
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
        }}
      >
        {/* Cover Image with fallback */}
        <CardMedia
          component="img"
          height="360"
          image={
            blog.imageUrl
              ? `http://localhost:3003/${blog.imageUrl.replace(/\\/g, '/')}`
              : '/default-blog.png'
          }
          alt={blog.title}
          sx={{
            borderRadius: 2,
            mb: 4,
            objectFit: 'cover',
            backgroundColor: '#f3f4f6',
          }}
        />

        {/* Title */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 2,
            color: '#111827',
            lineHeight: 1.2,
          }}
        >
          {blog.title}
        </Typography>

        {/* Author of the external article */}
        <Typography variant="subtitle1" sx={{ color: '#6b7280', mb: 2 }}>
          Article by <strong>{blog.author || 'Unknown author'}</strong>
        </Typography>

        {/* Clickable URL */}
        <Typography variant="body1" sx={{ mb: 3 }}>
          Source:{' '}
          <Link
            href={blog.url}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              color: '#2563eb',
              fontWeight: 600,
              wordBreak: 'break-all',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {blog.url}
          </Link>
        </Typography>

        {/* Posted by user */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <Avatar sx={{ bgcolor: '#2563eb' }}>
            {blog.user?.name?.charAt(0) || '?'}
          </Avatar>
          <Typography variant="body1" sx={{ color: '#6b7280' }}>
            Shared by <strong>{blog.user?.name}</strong>
          </Typography>
        </Stack>

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mb: 4 }}>
            {blog.tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                clickable
                sx={{
                  bgcolor: '#f3f4f6',
                  fontWeight: 500,
                  textTransform: 'lowercase',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: '#e5e7eb' },
                }}
                onClick={() => navigate(`/tags/${tag}`)}
              />
            ))}
          </Stack>
        )}

        <Divider sx={{ mb: 4 }} />

        {/* Like / Delete */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 4 }}>
          <IconButton
            onClick={handleLike}
            sx={{
              color: userHasLiked ? '#ef4444' : '#9ca3af',
              '&:hover': { transform: 'scale(1.1)' },
              transition: '0.2s',
            }}
          >
            {userHasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>

          <Typography sx={{ color: '#6b7280' }}>
            {blog.likes.length} Likes
          </Typography>

          {blog.user?.username === user.username && (
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete Post
            </Button>
          )}
        </Stack>

        <Divider sx={{ mb: 3 }} />

        {/* Comments */}
        <Typography variant="h5" sx={{ mb: 2 }}>
          Comments
        </Typography>

        <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
          <TextField
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            fullWidth
            label="Add a comment"
            multiline
            minRows={2}
            sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" size="large">
            Post Comment
          </Button>
        </Box>

        <Stack spacing={2}>
          {blog.comments.length > 0 ? (
            blog.comments.map((c) => (
              <Paper
                key={c.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: '#f9fafb',
                  border: '1px solid #e5e7eb',
                }}
              >
                <Typography variant="body2" sx={{ color: '#374151' }}>
                  {c.content}
                </Typography>
              </Paper>
            ))
          ) : (
            <Typography variant="body2" sx={{ color: '#9ca3af' }}>
              No comments yet
            </Typography>
          )}
        </Stack>
      </Paper>
    </Container>
  )
}

export default Blog
