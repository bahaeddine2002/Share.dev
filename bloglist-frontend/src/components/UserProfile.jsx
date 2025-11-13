// src/components/UserProfile.jsx
import { useEffect, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Paper,
  TextField,
  Button,
  Stack,
} from '@mui/material'
import BlogCard from './BlogCard'
import {
  fetchUserById,
  editUserBio,
  changeUserAvatar,
  followUser,
  unfollowUser,
} from '../reducers/usersReducer'

const UserProfile = () => {
  const { id } = useParams()
  const dispatch = useDispatch()

  const { selected: profile, loading } = useSelector((state) => state.users)
  const currentUser = useSelector((state) => state.user)

  const [bio, setBio] = useState('')
  const [avatarFile, setAvatarFile] = useState(null)
  const [isEditingBio, setIsEditingBio] = useState(false)

  // --- Fetch profile when route changes ---
  useEffect(() => {
    if (id) dispatch(fetchUserById(id))
  }, [dispatch, id])

  // --- Update local state when profile loads ---
  useEffect(() => {
    if (profile) setBio(profile.bio || '')
  }, [profile])

  const isFollowing = useMemo(() => {
    if (!profile?.followers || !currentUser) return false
    // followers can be populated or just IDs
    return profile.followers.some(
      (f) => f.id === currentUser.id || f === currentUser.id
    )
  }, [profile?.followers, currentUser?.id])

  // --- Loading state ---
  if (loading || !profile) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress />
      </Box>
    )
  }

  // --- Ownership check ---
  const isOwner =
    (currentUser?.id && currentUser.id === profile?.id) ||
    (currentUser?.googleId && currentUser.googleId === profile?.googleId) ||
    (currentUser?.username && currentUser.username === profile?.username)

  // --- Handlers ---
  const handleBioSave = () => {
    if (bio.trim() === '') return
    dispatch(editUserBio(profile.id, bio))
    setIsEditingBio(false)
  }

  const handleFollowToggle = () => {
    if (isFollowing) dispatch(unfollowUser(profile.id))
    else dispatch(followUser(profile.id))
  }

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      setAvatarFile(file)
    } else {
      alert('Please select a valid image file (jpg, png, webp, etc.)')
    }
  }

  const handleAvatarUpload = () => {
    if (!avatarFile) return
    dispatch(changeUserAvatar(profile.id, avatarFile))
    setAvatarFile(null)
  }

  // --- UI Rendering ---
  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Paper
        sx={{
          p: 4,
          borderRadius: 3,
          mb: 6,
          boxShadow: 3,
          bgcolor: 'background.paper',
        }}
      >
        {/* Header Section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 3,
            flexWrap: 'wrap',
            gap: 2,
          }}
        >
          <Avatar
            src={
              profile?.avatarUrl
                ? `http://localhost:3003/${profile.avatarUrl.replace(/\\/g, '/')}`
                : '/default-avatar.png'
            }
            sx={{
              width: 100,
              height: 100,
              mr: 3,
              bgcolor: '#1976d2',
              flexShrink: 0,
            }}
          >
            {profile?.name?.charAt(0)?.toUpperCase() ||
              profile?.username?.charAt(0)?.toUpperCase()}
          </Avatar>

          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              {profile.name || profile.username}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              @{profile.username}
            </Typography>

            {!isOwner && (
              <Button
                variant={isFollowing ? 'outlined' : 'contained'}
                color={isFollowing ? 'error' : 'primary'}
                sx={{ mt: 2, textTransform: 'none', borderRadius: 2 }}
                onClick={handleFollowToggle}
              >
                {isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            )}
          </Box>
        </Box>

        {/* Followers Count */}
        <Stack direction="row" spacing={3} sx={{ mt: 1, mb: 2 }}>
          <Typography variant="body2">
            <strong>{profile?.followers?.length || 0}</strong> Followers
          </Typography>
          <Typography variant="body2">
            <strong>{profile?.following?.length || 0}</strong> Following
          </Typography>
        </Stack>

        {/* Bio Section */}
        {!isOwner ? (
          <Typography variant="body1" sx={{ mb: 2 }}>
            {profile.bio || 'No bio yet.'}
          </Typography>
        ) : (
          <Box sx={{ mt: 3 }}>
            <Typography variant="h6" sx={{ mb: 1 }}>
              About Me
            </Typography>

            {!isEditingBio ? (
              <Box>
                <Typography
                  variant="body1"
                  sx={{
                    mb: 2,
                    color: 'text.secondary',
                    whiteSpace: 'pre-line',
                  }}
                >
                  {profile.bio || 'No bio yet. Click edit to add one.'}
                </Typography>
                <Button
                  variant="outlined"
                  sx={{ borderRadius: 2, textTransform: 'none' }}
                  onClick={() => setIsEditingBio(true)}
                >
                  Edit Bio
                </Button>
              </Box>
            ) : (
              <Box>
                <TextField
                  label="Edit your bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  fullWidth
                  multiline
                  minRows={2}
                  sx={{ mb: 2 }}
                />
                <Button
                  variant="contained"
                  onClick={handleBioSave}
                  sx={{ mr: 2, borderRadius: 2 }}
                >
                  Save
                </Button>
                <Button
                  variant="text"
                  color="error"
                  onClick={() => {
                    setBio(profile.bio || '')
                    setIsEditingBio(false)
                  }}
                >
                  Cancel
                </Button>
              </Box>
            )}

            {/* Avatar Upload */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Profile Picture
              </Typography>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
              />
              <Button
                variant="outlined"
                sx={{ ml: 2, borderRadius: 2 }}
                onClick={handleAvatarUpload}
                disabled={!avatarFile}
              >
                Upload Avatar
              </Button>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Blog List */}
      <Typography variant="h5" sx={{ mb: 3 }}>
        Posts by {profile.name || profile.username}
      </Typography>
      <Grid container spacing={4}>
        {profile.blogs?.length > 0 ? (
          profile.blogs.map((blog) => (
            <Grid
              item
              xs={12}
              sm={6}
              md={4}
              key={blog.id || blog._id || Math.random()}
            >
              <BlogCard blog={blog} />
            </Grid>
          ))
        ) : (
          <Typography sx={{ pl: 2, color: 'text.secondary' }}>
            No posts yet.
          </Typography>
        )}
      </Grid>
    </Container>
  )
}

export default UserProfile
