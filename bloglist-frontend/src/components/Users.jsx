// src/components/Users.jsx
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Container,
  CircularProgress,
} from '@mui/material'
import { fetchAllUsers } from '../reducers/usersReducer'

const Users = () => {
  const dispatch = useDispatch()
  const { list: users, loading } = useSelector((state) => state.users)

  useEffect(() => {
    dispatch(fetchAllUsers())
  }, [dispatch])

  if (loading)
    return (
      <Container
        sx={{
          py: 8,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <CircularProgress />
      </Container>
    )

  if (!users || users.length === 0)
    return (
      <Container sx={{ py: 8 }}>
        <Typography>No users found</Typography>
      </Container>
    )

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Paper sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 3 }}>
          Users
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Blogs</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <Link
                    to={`/users/${u.id}`}
                    style={{ textDecoration: 'none', color: '#2563eb' }}
                  >
                    {u.name || u.username}
                  </Link>
                </TableCell>
                <TableCell>{u.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  )
}

export default Users
