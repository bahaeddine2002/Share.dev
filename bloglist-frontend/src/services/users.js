import axios from '../apiClient'

const baseUrl = '/api/users'

// --------------------
// GET all users
// --------------------
const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

// --------------------
// GET user by ID
// --------------------
const getById = async (id) => {
  const response = await axios.get(`${baseUrl}/${id}`)
  return response.data
}

// --------------------
// PUT update bio
// --------------------
const updateUserBio = async (id, bio) => {
  const response = await axios.put(`${baseUrl}/${id}`, { bio })
  return response.data
}

// --------------------
// PUT upload avatar
// --------------------
const uploadUserAvatar = async (id, file) => {
  const formData = new FormData()
  formData.append('avatar', file)

  const response = await axios.put(`${baseUrl}/${id}/avatar`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

const followUser = async (id) => {
  const res = await axios.post(`${baseUrl}/${id}/follow`)
  return res.data // now contains updated user
}

const unfollowUser = async (id) => {
  const res = await axios.delete(`${baseUrl}/${id}/follow`)
  return res.data
}

export default {
  getAll,
  getById,
  updateUserBio,
  uploadUserAvatar,
  followUser,
  unfollowUser,
}
