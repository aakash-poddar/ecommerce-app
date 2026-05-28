import axios from 'axios'

const API_BASE = import.meta.env.VITE_API_BASE || '/api'

const client = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach JWT token from localStorage if present
client.interceptors.request.use((config) => {
  try {
    const raw = localStorage.getItem('shopEaseToken')
    const token = raw ? JSON.parse(raw) : null
    if (token) {
      config.headers = config.headers || {}
      config.headers.Authorization = `Bearer ${token}`
    }
  } catch (e) {
    // ignore
  }
  return config
})

export default client
