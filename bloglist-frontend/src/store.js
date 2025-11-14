import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogreducer'
import notificationsReducer from './reducers/notificationsReducer.js'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    notifications: notificationsReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
  },
})

export default store
