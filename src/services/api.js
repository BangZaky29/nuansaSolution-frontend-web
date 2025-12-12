import axios from 'axios'
import storage from '../utils/storage'

// Base URL dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - tambahkan token ke setiap request
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired atau invalid, clear auth dan redirect ke login
      storage.clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth Services
export const authService = {
  // Register user baru
  register: async (email, phone, password) => {
    const response = await api.post('/auth/register', {
      email,
      phone,
      password
    })
    return response.data
  },

  // Login user
  login: async (email, password) => {
    const response = await api.post('/auth/login', {
      email,
      password
    })
    return response.data
  },

  // Logout user
  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  }
}

// User Services
export const userService = {
  // Check user access
  checkAccess: async (userId) => {
    const response = await api.get(`/user/${userId}/access`)
    return response.data
  },

  // Get user profile
  getProfile: async (userId) => {
    const response = await api.get(`/user/${userId}/profile`)
    return response.data
  },

  // Get user orders
  getOrders: async (userId, status) => {
    const params = status ? { status } : {}
    const response = await api.get(`/user/${userId}/orders`, { params })
    return response.data
  }
}

// Payment Services
export const paymentService = {
  // Create payment
  createPayment: async (userId, packageName, grossAmount) => {
    const response = await api.post('/payment/create', {
      user_id: userId,
      package_name: packageName,
      gross_amount: grossAmount
    })
    return response.data
  },

  // Check payment status
  checkStatus: async (orderId) => {
    const response = await api.get(`/payment/${orderId}/status`)
    return response.data
  },

  // Cancel payment
  cancelPayment: async (orderId) => {
    const response = await api.post(`/payment/${orderId}/cancel`)
    return response.data
  }
}

export default api