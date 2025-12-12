// Storage utility untuk mengelola token dan user data

const TOKEN_KEY = 'auth_token'
const USER_KEY = 'auth_user'

export const storage = {
  // Token management
  setToken: (token) => {
    localStorage.setItem(TOKEN_KEY, token)
  },

  getToken: () => {
    return localStorage.getItem(TOKEN_KEY)
  },

  removeToken: () => {
    localStorage.removeItem(TOKEN_KEY)
  },

  // User management
  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  getUser: () => {
      try {
      const user = localStorage.getItem(USER_KEY)

      if (!user || user === 'undefined' || user === 'null') {
        return null
      }

      return JSON.parse(user)
    } catch (error) {
      console.error('Error parsing user from storage:', error)
      return null
    }
  },

  removeUser: () => {
    localStorage.removeItem(USER_KEY)
  },

  // Clear all auth data
  clearAuth: () => {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }
}

export default storage