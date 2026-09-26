import axios from 'axios'
const adminApiClient = axios.create({
  baseURL: import.meta.env.VITE_SOMETHING_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

adminApiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default adminApiClient