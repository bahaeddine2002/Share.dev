import axios from '../apiClient'

const baseUrl = '/api/notifications'

const getAll = async () => {
  const res = await axios.get(baseUrl)
  return res.data
}

const markRead = async (id) => {
  const res = await axios.put(`${baseUrl}/${id}/read`)
  return res.data
}

export default { getAll, markRead }
