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
    const requestPath = String(config.url || '')
    const isPublicProductRoute = requestPath === '/products' || requestPath.startsWith('/products/')

    if (isPublicProductRoute) {
      if (config.headers) {
        delete config.headers['Content-Type']
        delete config.headers['content-type']
      }
      return config
    }

    if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
      if (config.headers) {
        delete config.headers['Content-Type']
        delete config.headers['content-type']
      }
    }

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
