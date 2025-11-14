import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchNotifications,
  readNotification,
} from '../reducers/notificationsReducer.js'
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
} from '@mui/material'

const NotificationsPage = () => {
  const dispatch = useDispatch()
  const { list } = useSelector((state) => state.notifications)

  useEffect(() => {
    dispatch(fetchNotifications())
  }, [dispatch])

  return (
    <Container maxWidth="md" sx={{ py: 6 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 700 }}>
        Notifications
      </Typography>

      <List>
        {list.length === 0 ? (
          <Typography color="text.secondary">No notifications yet.</Typography>
        ) : (
          list.map((n) => (
            <Paper
              key={n.id}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 2,
                bgcolor: n.read ? 'background.paper' : '#f0f9ff',
                cursor: 'pointer',
                '&:hover': { bgcolor: '#e0f2fe' },
              }}
              onClick={() => dispatch(readNotification(n.id))}
            >
              <ListItem disablePadding>
                <ListItemText
                  primary={`${n.sender.name || n.sender.username} ${
                    n.type === 'like'
                      ? 'liked your post'
                      : n.type === 'comment'
                        ? 'commented on your post'
                        : 'started following you'
                  }`}
                  secondary={n.blog?.title}
                />
              </ListItem>
            </Paper>
          ))
        )}
      </List>
    </Container>
  )
}

export default NotificationsPage
