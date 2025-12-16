// Storage utility untuk mengelola token dan user data

const TOKEN_KEY = 'auth_token'
const TOKEN_EXPIRY_KEY = 'auth_token_expiry'
const USER_KEY = 'auth_user'

export const storage = {
  // Token management
  setToken: (token, expiresIn = 86400) => {
    // expiresIn dalam seconds, default 24 jam
    const expiryTime = Date.now() + (expiresIn * 1000)
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString())
  },

  getToken: () => {
    // Check if token is still valid before returning
    if (!storage.isTokenValid()) {
      storage.clearAuth()
      return null
    }
    return localStorage.getItem(TOKEN_KEY)
  },

  isTokenValid: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiry) return false
    return Date.now() < parseInt(expiry)
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
  },

  // User management
  setUser: (user) => {
    if (!user) {
      console.warn('Attempted to set null/undefined user')
      return
    }
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getUser: () => {
    try {
      const user = localStorage.getItem(USER_KEY)

      if (!user || user === 'undefined' || user === 'null') {
        return null
      }

      const parsed = JSON.parse(user)

      // Validate user structure
      if (!parsed?.email || !parsed?.id) {
        console.warn('Invalid user data structure in storage')
        storage.clearAuth()
        return null
      }

      return parsed
    } catch (error) {
      console.error('Error parsing user from storage:', error)
      storage.clearAuth()
      return null
    }
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY)
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRY_KEY)
    localStorage.removeItem(USER_KEY)
  },

  // Get token expiry info (for debugging/display)
  getTokenExpiryInfo: () => {
    const expiry = localStorage.getItem(TOKEN_EXPIRY_KEY)
    if (!expiry) return null

    const expiryTime = parseInt(expiry)
    const now = Date.now()
    const remainingMs = expiryTime - now

    return {
      expiryTime: new Date(expiryTime),
      remainingMs,
      remainingMinutes: Math.floor(remainingMs / 1000 / 60),
      isValid: remainingMs > 0
    }
  }
}

export default storage