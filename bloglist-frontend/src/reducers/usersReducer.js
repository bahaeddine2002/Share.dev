import { createSlice } from '@reduxjs/toolkit'
import userService from '../services/users'

const usersSlice = createSlice({
  name: 'users',
  initialState: {
    list: [], // all users
    selected: null, // profile being viewed
    loading: false,
    error: null,
  },
  reducers: {
    setUsers(state, action) {
      state.list = action.payload
    },
    setSelectedUser(state, action) {
      state.selected = action.payload
    },
    setLoading(state, action) {
      state.loading = action.payload
    },
    setError(state, action) {
      state.error = action.payload
    },
    updateUserFollow(state, action) {
      const updated = action.payload
      state.list = state.list.map((u) => (u.id === updated.id ? updated : u))
      if (state.selected?.id === updated.id) state.selected = updated
    },
  },
})

export const {
  setUsers,
  setSelectedUser,
  setLoading,
  setError,
  updateUserFollow,
} = usersSlice.actions

// --------------------
// Async Thunks
// --------------------

// 1️⃣ Fetch all users
export const fetchAllUsers = () => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const users = await userService.getAll()
    dispatch(setUsers(users))
  } catch (err) {
    console.error('Error fetching users:', err)
    dispatch(setError('Failed to load users'))
  } finally {
    dispatch(setLoading(false))
  }
}

// 2️⃣ Fetch a user by ID (with caching)
export const fetchUserById = (id) => async (dispatch, getState) => {
  const cachedUser = getState().users.list.find((u) => u.id === id)
  if (cachedUser) {
    dispatch(setSelectedUser(cachedUser))
    return
  }

  dispatch(setLoading(true))
  try {
    const user = await userService.getById(id)
    dispatch(setSelectedUser(user))
  } catch (err) {
    console.error('Error fetching user:', err)
    dispatch(setError('Failed to load user'))
  } finally {
    dispatch(setLoading(false))
  }
}

// 3️⃣ Update user bio
export const editUserBio = (id, bio) => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const updatedUser = await userService.updateUserBio(id, bio)
    dispatch(setSelectedUser(updatedUser))
  } catch (err) {
    console.error('Error updating bio:', err)
    dispatch(setError('Failed to update bio'))
  } finally {
    dispatch(setLoading(false))
  }
}

// 4️⃣ Upload avatar
export const changeUserAvatar = (id, file) => async (dispatch) => {
  dispatch(setLoading(true))
  try {
    const updatedUser = await userService.uploadUserAvatar(id, file)
    dispatch(setSelectedUser(updatedUser))
  } catch (err) {
    console.error('Error uploading avatar:', err)
    dispatch(setError('Failed to upload avatar'))
  } finally {
    dispatch(setLoading(false))
  }
}

export const followUser = (id) => async (dispatch) => {
  try {
    const updatedUser = await userService.followUser(id)
    dispatch(updateUserFollow(updatedUser))
  } catch (err) {
    dispatch(setError('Failed to follow user'))
  }
}

// 🔹 Unfollow user
export const unfollowUser = (id) => async (dispatch) => {
  try {
    const updatedUser = await userService.unfollowUser(id)
    dispatch(updateUserFollow(updatedUser))
  } catch (err) {
    dispatch(setError('Failed to unfollow user'))
  }
}

export default usersSlice.reducer
