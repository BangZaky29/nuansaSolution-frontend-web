import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/ToastContainer'
import { useNavigate, Link, useSearchParams } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import './AuthForm.css'

const LoginForm = () => {
  const { login } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  // Check if there's a redirect parameter
  const redirectPath = searchParams.get('redirect')

  useEffect(() => {
    // Show info if redirected from checkout
    if (redirectPath === 'checkout') {
      showError('Anda harus login terlebih dahulu untuk melanjutkan pembayaran')
    }
  }, [redirectPath, showError])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error untuk field yang sedang diisi
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email) {
      newErrors.email = 'Email harus diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      showError('Mohon periksa kembali form Anda')
      return
    }

    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)
      
      if (result.success) {
        showSuccess(`Selamat datang kembali, ${result.data.user.email}!`)
        
        // Check if there's a saved package to checkout
        const savedPackage = sessionStorage.getItem('selectedPackage')
        
        setTimeout(() => {
          if (redirectPath === 'checkout' && savedPackage) {
            // Redirect to checkout with saved package
            navigate('/checkout', { 
              state: { package: JSON.parse(savedPackage) } 
            })
          } else {
            // Normal redirect to home
            navigate('/')
          }
        }, 500)
      } else {
        showError(result.error || 'Login gagal. Silakan coba lagi.')
      }
    } catch (error) {
      showError('Terjadi kesalahan. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-form-container">
      <div className="auth-form-card">
        <div className="auth-form-header">
          <div className="auth-icon">
            <Lock size={32} />
          </div>
          <h2>Selamat Datang Kembali</h2>
          <p>Masuk ke akun Nuansa Solution Anda</p>
          {redirectPath === 'checkout' && (
            <div className="redirect-info">
              <AlertCircle size={16} />
              <span>Login untuk melanjutkan ke pembayaran</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email
            </label>
            <div className="input-with-icon">
              <Mail className="input-icon" size={20} />
              <input
                type="email"
                id="email"
                name="email"
                className={`form-input ${errors.email ? 'input-error' : ''}`}
                placeholder="nama@email.com"
                value={formData.email}
                onChange={handleChange}
                disabled={loading}
                autoComplete="email"
              />
            </div>
            {errors.email && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.email}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`form-input ${errors.password ? 'input-error' : ''}`}
                placeholder="Masukkan password"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.password}</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-full"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>
        </form>

        <div className="auth-form-footer">
          <p>
            Belum punya akun?{' '}
            <Link 
              to={redirectPath ? `/register?redirect=${redirectPath}` : '/register'} 
              className="auth-link"
            >
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginForm