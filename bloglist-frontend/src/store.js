import { configureStore } from '@reduxjs/toolkit'
import blogReducer from './reducers/blogreducer'
import notificationReducer from './reducers/notficationReducer'
import userReducer from './reducers/userReducer'
import usersReducer from './reducers/usersReducer'

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogReducer,
    user: userReducer,
    users: usersReducer,
  },
})

export default store
