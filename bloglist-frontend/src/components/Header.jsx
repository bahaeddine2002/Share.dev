import { useSelector, useDispatch } from 'react-redux'
import { logout } from '../reducers/userReducer'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Badge,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import NotificationsIcon from '@mui/icons-material/Notifications'

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)
  const unread = useSelector((state) => state.notifications?.unreadCount || 0)
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen)

  const navLinks = [
    { title: 'Feed', path: '/' },
    { title: 'Explore', path: '/explore' },
    { title: 'Users', path: '/users' },
  ]

  const onLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const drawer = (
    <Box
      onClick={handleDrawerToggle}
      sx={{
        textAlign: 'center',
        p: 2,
        bgcolor: '#fff',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* --- Logo --- */}
      <Typography variant="h6" sx={{ my: 2, fontWeight: 700 }}>
        Share.dev
      </Typography>

      {/* --- Nav Links --- */}
      <Box>
        <List>
          {navLinks.map((item) => (
            <ListItem key={item.title} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                sx={{
                  textAlign: 'center',
                  py: 1.5,
                  fontWeight: 600,
                  color: '#111827',
                  '&:hover': { bgcolor: '#f3f4f6' },
                }}
              >
                <ListItemText primary={item.title} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider sx={{ my: 1 }} />

          {/* --- Write Post --- */}
          <ListItem disablePadding>
            <ListItemButton
              component={RouterLink}
              to="/blogs/new"
              sx={{
                textAlign: 'center',
                bgcolor: '#2563eb',
                color: 'white',
                borderRadius: 2,
                fontWeight: 600,
                '&:hover': { bgcolor: '#1d4ed8' },
              }}
            >
              <ListItemText primary="Write a Post ✍️" />
            </ListItemButton>
          </ListItem>

          {/* --- Notifications --- */}
          <ListItem
            disablePadding
            sx={{ justifyContent: 'center', mt: 2 }}
            onClick={() => navigate('/notifications')}
          >
            <ListItemButton sx={{ justifyContent: 'center' }}>
              <Badge badgeContent={unread} color="error">
                <NotificationsIcon sx={{ color: '#2563eb' }} />
              </Badge>
              <Typography sx={{ ml: 1, fontWeight: 500 }}>
                Notifications
              </Typography>
            </ListItemButton>
          </ListItem>
        </List>
      </Box>

      {/* --- Logout --- */}
      <Box sx={{ mb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          onClick={onLogout}
          sx={{
            textTransform: 'none',
            borderRadius: 2,
            bgcolor: '#16a34a',
            '&:hover': { bgcolor: '#15803d' },
          }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  )

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        component="nav"
        position="static"
        elevation={0}
        sx={{
          bgcolor: '#ffffff',
          color: 'text.primary',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <Toolbar>
          {/* --- Logo --- */}
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 700,
              letterSpacing: 0.5,
            }}
          >
            Share.dev
          </Typography>

          {/* --- Desktop Nav --- */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 2,
            }}
          >
            {navLinks.map((item) => (
              <Button
                key={item.title}
                component={RouterLink}
                to={item.path}
                sx={{
                  textTransform: 'none',
                  color: 'text.primary',
                  fontWeight: 500,
                }}
              >
                {item.title}
              </Button>
            ))}

            {/* Write Post button */}
            <Button
              component={RouterLink}
              to="/blogs/new"
              variant="contained"
              color="primary"
              sx={{
                textTransform: 'none',
                ml: 2,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              Write a Post
            </Button>

            {/* Notifications */}
            <IconButton
              onClick={() => navigate('/notifications')}
              sx={{ ml: 1 }}
            >
              <Badge badgeContent={unread} color="error">
                <NotificationsIcon sx={{ color: '#2563eb' }} />
              </Badge>
            </IconButton>

            <Typography variant="body2" sx={{ mx: 2 }}>
              {user?.name}
            </Typography>

            <Button
              onClick={onLogout}
              variant="contained"
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                bgcolor: '#16a34a',
                '&:hover': { bgcolor: '#15803d' },
              }}
            >
              Logout
            </Button>
          </Box>

          {/* --- Mobile menu icon --- */}
          <IconButton
            color="inherit"
            edge="start"
            sx={{ display: { md: 'none' } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* --- Drawer for Mobile --- */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          display: { md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 260,
            borderLeft: '1px solid #e5e7eb',
          },
        }}
      >
        {drawer}
      </Drawer>
    </Box>
  )
}

export default Header
