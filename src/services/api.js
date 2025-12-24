// src/services/api.js (UPDATED & EXPANDED)
import axios from 'axios'
import storage from '../utils/storage'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token) {
      if (!storage.isTokenValid()) {
        storage.clearAuth()
        window.location.href = '/login'
        return Promise.reject(new Error('Token expired'))
      }
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      storage.clearAuth()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ============================================
// AUTH SERVICES (existing)
// ============================================
export const authService = {
  register: async (email, phone, password) => {
    try {
      const response = await api.post('/auth/register', {
        email, phone, password, password_confirm: password
      })
      return response.data
    } catch (error) {
      throw error
    }
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  }
}

// ============================================
// PAYMENT SERVICES
// ============================================
export const paymentService = {
  // Create payment - sesuai dengan backend: package_name, gross_amount, payment_method
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
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal membuat pembayaran'
      }
    }
  },

  // Check payment status - sesuai dengan backend endpoint: /payment/status/:order_id
  checkStatus: async (orderId) => {
    try {
      const response = await api.get(`/payment/status/${orderId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal memeriksa status pembayaran'
      }
    }
  },

  // Verify payment from Midtrans - sesuai dengan backend endpoint: /payment/verify/:order_id
  verifyPayment: async (orderId) => {
    try {
      const response = await api.post(`/payment/verify/${orderId}`)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal memverifikasi pembayaran'
      }
    }
  },

  // Resume payment - sesuai dengan backend endpoint: /payment/resume/:order_id
  resumePayment: async (orderId) => {
    try {
      const response = await api.post(`/payment/resume/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Resume payment API error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal melanjutkan pembayaran'
      }
    }
  },

  // Cancel payment - sesuai dengan backend endpoint: /payment/cancel/:order_id
  cancelPayment: async (orderId) => {
    try {
      const response = await api.post(`/payment/cancel/${orderId}`)
      return response.data
    } catch (error) {
      console.error('Cancel payment API error:', error)
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Gagal membatalkan pembayaran'
      }
    }
  }
}

// ============================================
// FEATURE SERVICES
// ============================================
export const featureService = {
  getAllFeatures: async () => {
    try {
      const response = await api.get('/features/all')
      return response.data
    } catch (error) {
      throw error
    }
  },
  getMySubscription: async () => {
    try {
      const response = await api.get('/features/my-subscription')
      return response.data
    } catch (error) {
      throw error
    }
  },
  checkFeatureAccess: async (featureCode) => {
    try {
      const response = await api.post('/features/check-access', {
        feature_code: featureCode
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  getUsageHistory: async (limit = 50) => {
    try {
      const response = await api.get('/features/usage-history', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

export const documentService = {
  generateSuratPerjanjian: async (data) => {
    try {
      const response = await api.post('/features/documents/generate-surat-perjanjian', data)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal generate dokumen'
      }
    }
  },
  generateSuratKuasa: async (data) => {
    try {
      const response = await api.post('/features/documents/generate-surat-kuasa', data)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal generate dokumen'
      }
    }
  },
  generateSuratPermohonan: async (data) => {
    try {
      const response = await api.post('/features/documents/generate-surat-permohonan', data)
      return response.data
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Gagal generate dokumen'
      }
    }
  }
}

export const notificationService = {
  getNotifications: async (limit = 20) => {
    try {
      const response = await api.get('/notifications', {
        params: { limit }
      })
      return response.data
    } catch (error) {
      throw error
    }
  },
  markAsRead: async (notificationId) => {
    try {
      const response = await api.put(`/notifications/${notificationId}/read`)
      return response.data
    } catch (error) {
      throw error
    }
  },
  markAllAsRead: async () => {
    try {
      const response = await api.put('/notifications/mark-all-read')
      return response.data
    } catch (error) {
      throw error
    }
  }
}

// ============================================
// USER SERVICES (existing - keep as is)
// ============================================
export const userService = {
  checkAccess: async (userId) => {
    const response = await api.get(`/user/${userId}/access`)
    return response.data
  },

  getProfile: async (userId) => {
    const response = await api.get(`/user/${userId}/profile`)
    return response.data
  },

  getOrders: async (userId, status) => {
    const params = status ? { status } : {}
    const response = await api.get(`/user/${userId}/orders`, { params })
    return response.data
  }
}

export default api
