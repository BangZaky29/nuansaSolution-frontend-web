import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/ToastContainer'
import { useNavigate, Link } from 'react-router-dom'
import { Mail, Lock, Phone, Eye, EyeOff, UserPlus, AlertCircle } from 'lucide-react'
import './AuthForm.css'

const RegisterForm = () => {
  const { register } = useAuth()
  const { showSuccess, showError } = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

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

    // Email validation
    if (!formData.email) {
      newErrors.email = 'Email harus diisi'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid'
    }

    // Phone validation
    if (!formData.phone) {
      newErrors.phone = 'Nomor telepon harus diisi'
    } else if (!/^[0-9]{10,13}$/.test(formData.phone.replace(/[^0-9]/g, ''))) {
      newErrors.phone = 'Nomor telepon tidak valid (10-13 digit)'
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = 'Password harus diisi'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter'
    } else if (!/(?=.*[a-z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'Password harus mengandung huruf dan angka'
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok'
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
      const result = await register(formData.email, formData.phone, formData.password)
      
      if (result.success) {
        showSuccess('Registrasi berhasil! Silakan login dengan akun Anda.')
        setTimeout(() => {
          navigate('/login')
        }, 1500)
      } else {
        showError(result.error || 'Registrasi gagal. Silakan coba lagi.')
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
            <UserPlus size={32} />
          </div>
          <h2>Buat Akun Baru</h2>
          <p>Bergabunglah dengan Nuansa Legal sekarang</p>
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
            <label htmlFor="phone" className="form-label">
              Nomor Telepon
            </label>
            <div className="input-with-icon">
              <Phone className="input-icon" size={20} />
              <input
                type="tel"
                id="phone"
                name="phone"
                className={`form-input ${errors.phone ? 'input-error' : ''}`}
                placeholder="08123456789"
                value={formData.phone}
                onChange={handleChange}
                disabled={loading}
                autoComplete="tel"
              />
            </div>
            {errors.phone && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.phone}</span>
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
                placeholder="Minimal 6 karakter"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
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

          <div className="form-group">
            <label htmlFor="confirmPassword" className="form-label">
              Konfirmasi Password
            </label>
            <div className="input-with-icon">
              <Lock className="input-icon" size={20} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                placeholder="Ulangi password"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={loading}
                autoComplete="new-password"
              />
              <button
                type="button"
                className="toggle-password"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                tabIndex="-1"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="form-error">
                <AlertCircle size={14} />
                <span>{errors.confirmPassword}</span>
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
              'Daftar Sekarang'
            )}
          </button>
        </form>

        <div className="auth-form-footer">
          <p>
            Sudah punya akun?{' '}
            <Link to="/login" className="auth-link">
              Masuk sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default RegisterForm