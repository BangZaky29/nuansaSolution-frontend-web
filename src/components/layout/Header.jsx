import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../common/ToastContainer'
import { LogOut, User, Settings, ChevronDown, Menu, X, Bell } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import './Header.css'
import '../../styles/mobile/Header.mobile.css'
import LogoImage from '../../assets/NS_blank_02.png'
import { notificationService, userService } from '../../services/api'


const Header = () => {
  const { user, logout, isAuthenticated } = useAuth()
  const { showSuccess, showInfo } = useToast()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const dropdownRef = useRef(null)
  const notifRef = useRef(null)
  const [unread, setUnread] = useState(0)
  const [notifications, setNotifications] = useState([])
  const [hasSubscription, setHasSubscription] = useState(false)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      const outsideProfile = dropdownRef.current && !dropdownRef.current.contains(event.target)
      const outsideNotif = notifRef.current && !notifRef.current.contains(event.target)
      if (outsideProfile) {
        setShowDropdown(false)
      }
      if (outsideNotif) {
        setShowNotifications(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!isAuthenticated) {
        setUnread(0)
        setNotifications([])
        return
      }
      try {
        const resp = await notificationService.getNotifications(10)
        if (resp?.success && resp.data) {
          setUnread(resp.data.unread_count || 0)
          setNotifications(resp.data.notifications || [])
        }
      } catch {
        setUnread(0)
        setNotifications([])
      }
    }
    fetchNotifications()
    const onFocus = () => fetchNotifications()
    window.addEventListener('focus', onFocus)
    return () => {
      window.removeEventListener('focus', onFocus)
    }
  }, [isAuthenticated])

  useEffect(() => {
    const fetchAccess = async () => {
      if (!isAuthenticated || !user?.email || !user?.id) {
        setHasSubscription(false)
        return
      }
      try {
        const accessResp = await userService.checkAccess(user.id)
        setHasSubscription(accessResp?.access === true)
      } catch {
        setHasSubscription(false)
      }
    }
    fetchAccess()
    const onFocus = () => fetchAccess()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [isAuthenticated, user?.id, user?.email])

  const handleMarkAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id)
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1, read_at: new Date().toISOString() } : n))
      )
      setUnread((u) => (u > 0 ? u - 1 : 0))
    } catch (e) {
      void e
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await notificationService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1, read_at: new Date().toISOString() })))
      setUnread(0)
      showSuccess('Semua notifikasi ditandai dibaca')
    } catch (e) {
      void e
    }
  }

  const handleLogout = async () => {
    setShowDropdown(false)
    setMobileOpen(false)
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

            <button
              className="hamburger-btn"
              aria-label="Toggle navigation"
              onClick={() => setMobileOpen(!mobileOpen)}
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

          {/* Navigation */}
          <nav className="nav">
            <Link to="/" className="nav-link">Beranda</Link>
            <Link to="/tools" className="nav-link">Web Layanan</Link>
          </nav>

          {/* Auth Section */}
          <div className="auth-section">
            {hasSubscription && (
              <span className="subscription-badge">Berlangganan</span>
            )}
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
                <button 
                  className="notifications-button"
                  aria-label="Notifikasi"
                  title="Notifikasi"
                  onClick={() => {
                    setShowNotifications((s) => !s)
                    setShowDropdown(false)
                  }}
                >
                  <Bell size={20} />
                  {unread > 0 && <span className="notif-badge">{unread}</span>}
                </button>
                {showNotifications && (
                  <div className="notifications-dropdown" ref={notifRef}>
                    <div className="notifications-header">
                      <span>Notifikasi</span>
                      <button className="mark-all-btn" onClick={handleMarkAllAsRead}>
                        Tandai semua dibaca
                      </button>
                    </div>
                    <div className="notif-list">
                      {notifications.length === 0 && (
                        <div className="notif-empty">Tidak ada notifikasi</div>
                      )}
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          className={`notif-item ${n.is_read ? '' : 'unread'}`}
                        >
                          <div className="notif-content">
                            <div className="notif-title">{n.title}</div>
                            <div className="notif-message">{n.message}</div>
                            <div className="notif-meta">
                              <span>{new Date(n.created_at).toLocaleString('id-ID')}</span>
                            </div>
                          </div>
                          {!n.is_read && (
                            <button
                              className="notif-read-btn"
                              onClick={() => handleMarkAsRead(n.id)}
                            >
                              Tandai dibaca
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
        {mobileOpen && (
          <div className="mobile-nav">
            <div className="mobile-nav-content">
              <div className="mobile-links">
                <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Beranda</Link>
                <Link to="/tools" className="mobile-link" onClick={() => setMobileOpen(false)}>Web Layanan</Link>
                <button
                  className="mobile-link"
                  onClick={() => {
                    setShowNotifications(true)
                    setShowDropdown(false)
                    setMobileOpen(false)
                  }}
                >
                  Notifikasi {unread > 0 && <span className="notif-badge" style={{ marginLeft: 8 }}>{unread}</span>}
                </button>
                <Link
                  to={isAuthenticated ? "/profile" : "/login"}
                  className="mobile-link"
                  onClick={() => setMobileOpen(false)}
                >
                  Account
                </Link>
                <Link to="/" className="mobile-link" onClick={() => setMobileOpen(false)}>Langganan Budget</Link>
              </div>
              <div className="mobile-auth">
                {isAuthenticated ? (
                  <div className="mobile-user">
                    <div className="mobile-user-row">
                      <div className="profile-avatar" style={{ backgroundColor: getRandomColor(user.email) }}>
                        {getInitials(user.email)}
                      </div>
                      <div className="mobile-user-info">
                        <div className="mobile-user-email">{user.email}</div>
                        <div className="mobile-user-phone">{user.phone}</div>
                      </div>
                    </div>
                    <div className="mobile-actions">
                      <button className="mobile-btn" onClick={() => { setMobileOpen(false); navigate('/profile') }}>
                        <User size={18} />
                        <span>Profil</span>
                      </button>
                      <button className="mobile-btn" onClick={() => { setMobileOpen(false); navigate('/settings') }}>
                        <Settings size={18} />
                        <span>Pengaturan</span>
                      </button>
                      <button className="mobile-btn logout" onClick={handleLogout}>
                        <LogOut size={18} />
                        <span>Keluar</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" className="btn btn-primary btn-mobile-login" onClick={() => setMobileOpen(false)}>
                    Masuk
                  </Link>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
