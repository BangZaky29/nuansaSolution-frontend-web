import axios from 'axios'
import storage from '../utils/storage'

// Base URL dari environment variable
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

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
      // Cek apakah token masih valid
      if (!storage.isTokenValid()) {
        storage.clearAuth()
        window.location.href = '/login'
        return Promise.reject(new Error('Token expired'))
      }
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
    try {
      const response = await api.post('/auth/register', {
        email,
        phone,
        password,
        password_confirm: password
      })
      return response.data
    } catch (error) {
      // Re-throw error agar bisa ditangani di AuthContext
      throw error
    }
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
  createPayment: async (userId, packageName, grossAmount, paymentMethod = 'va_bca') => {
    try {
      const response = await api.post('/payment/create', {
        user_id: userId,
        package_name: packageName,
        gross_amount: grossAmount,
        payment_method: paymentMethod
      })
      return response.data
    } catch (error) {
      let errorMessage = 'Gagal membuat pembayaran'
      
      if (error.response) {
        switch (error.response.status) {
          case 400:
            errorMessage = error.response.data?.message || 'Data pembayaran tidak valid'
            break
          case 401:
            errorMessage = 'Anda harus login terlebih dahulu'
            break
          case 500:
            errorMessage = 'Server error. Silakan coba lagi nanti'
            break
          default:
            errorMessage = error.response.data?.message || errorMessage
        }
      } else if (error.request) {
        errorMessage = 'Tidak dapat terhubung ke server'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  },

  // Check payment status
  checkStatus: async (orderId) => {
    try {
      const response = await api.get(`/payment/${orderId}/status`)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal memeriksa status pembayaran'
      }
    }
  },

  // Cancel payment
  cancelPayment: async (orderId) => {
    try {
      const response = await api.post(`/payment/${orderId}/cancel`)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal membatalkan pembayaran'
      }
    }
  },

  // Get user payment history
  getPaymentHistory: async (userId) => {
    try {
      const response = await api.get(`/payment/history/${userId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal mengambil riwayat pembayaran'
      }
    }
  }
}

export default api