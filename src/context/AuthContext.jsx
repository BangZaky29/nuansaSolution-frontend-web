import { createContext, useContext, useState, useEffect } from 'react'
import { authService } from '../services/api'
import storage from '../utils/storage'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Check if user is logged in on mount
  useEffect(() => {
    const token = storage.getToken()
    const savedUser = storage.getUser()
    
    if (token && savedUser) {
      setUser(savedUser)
    }
    setLoading(false)
  }, [])

  // Register function
  const register = async (email, phone, password) => {
    try {
      const response = await authService.register(email, phone, password)
      return { success: true, data: response }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registrasi gagal'
      }
    }
  }

  // Login function
  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password)
      
      if (response.success && response.data) {
        const token = response.data.token
        const userData = {
          id: response.data.user_id,
          email: response.data.email,
          phone: response.data.phone
        }
        
        // Save to localStorage
        storage.setToken(token)
        storage.setUser(userData)
        
        // Update state
        setUser(userData)
        
        return { success: true, data: { token, user: userData } }
      }
      
      return {
        success: false,
        error: response.message || 'Login gagal'
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Login gagal'
      }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear storage dan state regardless of API call result
      storage.clearAuth()
      setUser(null)
    }
  }

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    isAuthenticated: !!user
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export default AuthContext
