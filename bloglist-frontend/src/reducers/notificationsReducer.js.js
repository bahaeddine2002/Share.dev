import { createSlice } from '@reduxjs/toolkit'
import notificationService from '../services/notifications'

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState: { list: [], unreadCount: 0 },
  reducers: {
    setNotifications(state, action) {
      state.list = action.payload
      state.unreadCount = action.payload.filter((n) => !n.read).length
    },
    markAsRead(state, action) {
      const id = action.payload
      const notif = state.list.find((n) => n.id === id)
      if (notif) notif.read = true
      state.unreadCount = state.list.filter((n) => !n.read).length
    },
  },
})

export const { setNotifications, markAsRead } = notificationsSlice.actions

export const fetchNotifications = () => async (dispatch) => {
  const data = await notificationService.getAll()
  dispatch(setNotifications(data))
}

export const readNotification = (id) => async (dispatch) => {
  await notificationService.markRead(id)
  dispatch(markAsRead(id))
}

export default notificationsSlice.reducer
