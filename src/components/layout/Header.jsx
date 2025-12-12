import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/ToastContainer'
import { LogOut, User, Settings, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import './Header.css'
import LogoImage from '../../assets/NS_blank_02.png'


const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { showSuccess, showInfo } = useToast()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = async () => {
    setShowDropdown(false)
    await logout()
    showInfo('Anda telah keluar dari akun')
    navigate('/')
  }

  const getInitials = (email) => {
    if (!email) return 'U'
    return email.substring(0, 2).toUpperCase()
  }

  const getRandomColor = (email) => {
    if (!email) return '#3B82F6'
    const colors = [
      '#3B82F6', // blue
      '#10B981', // green
      '#F59E0B', // amber
      '#EF4444', // red
      '#8B5CF6', // purple
      '#EC4899', // pink
    ]
    const index = email.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <Link to="/" className="logo">
              <img
                src={LogoImage}
                alt="Nuansa Solution"
                className="logo-image"
              />
            </Link>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link">Beranda</Link>
            <Link to="/layanan" className="nav-link">Layanan</Link>
            <Link to="/tentang" className="nav-link">Tentang</Link>
            <Link to="/kontak" className="nav-link">Kontak</Link>
          </nav>

          {/* Auth Section */}
          <div className="auth-section">
            {isAuthenticated ? (
              <div className="user-menu" ref={dropdownRef}>
                <button 
                  className="profile-button"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  <div 
                    className="profile-avatar"
                    style={{ backgroundColor: getRandomColor(user.email) }}
                  >
                    {getInitials(user.email)}
                  </div>
                  <span className="profile-email">{user.email}</span>
                  <ChevronDown 
                    size={18} 
                    className={`dropdown-icon ${showDropdown ? 'open' : ''}`}
                  />
                </button>

                {showDropdown && (
                  <div className="dropdown-menu">
                    <div className="dropdown-header">
                      <div className="dropdown-user-info">
                        <div className="dropdown-email">{user.email}</div>
                        <div className="dropdown-phone">{user.phone}</div>
                      </div>
                    </div>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item" onClick={() => {
                      setShowDropdown(false)
                      navigate('/profile')
                    }}>
                      <User size={18} />
                      <span>Profil Saya</span>
                    </button>
                    <button className="dropdown-item" onClick={() => {
                      setShowDropdown(false)
                      navigate('/settings')
                    }}>
                      <Settings size={18} />
                      <span>Pengaturan</span>
                    </button>
                    <div className="dropdown-divider"></div>
                    <button className="dropdown-item logout" onClick={handleLogout}>
                      <LogOut size={18} />
                      <span>Keluar</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="btn btn-primary btn-header">
                Masuk
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header