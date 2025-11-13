import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createBlog } from '../reducers/blogreducer'
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Chip,
} from '@mui/material'

const CreationForm = () => {
  const dispatch = useDispatch()
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [tags, setTags] = useState([]) // ✅ array of tags
  const [tagInput, setTagInput] = useState('') // ✅ current input field
  const [image, setImage] = useState(null)

  // ✅ Add tag when pressing Enter or clicking Add
  const handleAddTag = (e) => {
    e.preventDefault()
    const newTag = tagInput.trim().toLowerCase()

    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag])
    }

    setTagInput('')
  }

  // ✅ Remove tag
  const handleDeleteTag = (tagToDelete) => {
    setTags(tags.filter((tag) => tag !== tagToDelete))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newBlog = { title, author, url, tags, image }
    dispatch(createBlog(newBlog))

    // reset
    setTitle('')
    setAuthor('')
    setUrl('')
    setTags([])
    setImage(null)
  }

  return (
    <Container maxWidth="sm" sx={{ py: 6 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
          Create a New Post
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Title"
            fullWidth
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="Author"
            fullWidth
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            label="URL"
            fullWidth
            required
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            sx={{ mb: 2 }}
          />

          {/* ✅ Interactive Tag Input */}
          <Typography variant="subtitle1" sx={{ mb: 1 }}>
            Tags
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
              mb: 2,
              border: '1px solid #ddd',
              p: 1,
              borderRadius: 2,
            }}
          >
            {tags.map((tag) => (
              <Chip
                key={tag}
                label={`#${tag}`}
                onDelete={() => handleDeleteTag(tag)}
                color="primary"
                variant="outlined"
              />
            ))}
            <TextField
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag and press Enter"
              variant="standard"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleAddTag(e)
              }}
              sx={{ minWidth: 120 }}
            />
          </Box>

          {/* ✅ Image Upload */}
          <Box sx={{ mb: 3 }}>
            <input
              accept="image/*"
              id="upload-button-file"
              type="file"
              style={{ display: 'none' }}
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setImage(e.target.files[0])
                  e.target.value = null
                }
              }}
            />

            <label htmlFor="upload-button-file">
              <Button variant="contained" component="span">
                {image ? 'Change Image' : 'Upload Image'}
              </Button>
            </label>

            {image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                ✅ Selected: {image.name}
              </Typography>
            )}
          </Box>

          <Box>
            <Button type="submit" variant="contained" color="primary">
              Publish
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}

export default CreationForm
