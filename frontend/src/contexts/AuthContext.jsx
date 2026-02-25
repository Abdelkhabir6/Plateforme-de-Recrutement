import { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Configuration d'axios pour inclure le token
  // Utiliser le proxy Vite en développement, sinon l'URL complète
  axios.defaults.baseURL = import.meta.env.DEV ? '/api' : 'http://localhost:8000/api'
  axios.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => Promise.reject(error)
  )

  // Vérifier l'authentification au chargement
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const response = await axios.get('/me')
        setUser(response.data.user)
      } catch (error) {
        localStorage.removeItem('token')
      }
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    try {
      const response = await axios.post('/login', { email, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur de connexion'
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/register', userData)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      setUser(user)
      return { success: true }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Erreur d\'inscription',
        errors: error.response?.data?.errors
      }
    }
  }

  const logout = async () => {
    try {
      await axios.post('/logout')
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isCompany: user?.role === 'entreprise',
    isCandidate: user?.role === 'candidat',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

