import { createSlice } from '@reduxjs/toolkit'
import loginService from '../services/login'
import blogService from '../services/blogs'
import axios from '../apiClient'

const userSlice = createSlice({
  initialState: null,
  name: 'user',
  reducers: {
    setUser(state, action) {
      return action.payload
    },
    delUser(state, action) {
      return null
    },
  },
})

export const login = (userObj) => {
  return async (dispatch) => {
    try {
      const user = await loginService.login(userObj)

      dispatch(setUser(user))
    } catch (error) {}
  }
}

export const logout = () => {
  return async (dispatch) => {
    await loginService.logout()

    dispatch(delUser())
  }
}

export const initializeUser = () => {
  return async (dispatch) => {
    console.log('1. --- initializeUser thunk started ---')
    try {
      const response = await axios.get('/api/login/status')
      console.log('2. --- API call to /status SUCCEEDED. Response:', response)
      const user = response.data
      dispatch(setUser(user))
      return user
    } catch (error) {
      console.error('2. --- API call to /status FAILED. Error:', error)

      throw error
    }
  }
}

export const { setUser, delUser } = userSlice.actions

export default userSlice.reducer
