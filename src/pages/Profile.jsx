import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService, paymentService } from '../services/api'
import { useToast } from '../components/common/ToastContainer'
import { useNavigate } from 'react-router-dom'
import { User, Package, Calendar, DollarSign, CheckCircle, Clock, XCircle, RefreshCw, Mail, Phone, CreditCard, X } from 'lucide-react'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const { showError, showSuccess, showInfo } = useToast()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processingOrder, setProcessingOrder] = useState(null)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user?.id) return

      setLoading(true)
      try {
        const response = await userService.getProfile(user.id)
        if (response.success) {
          setProfileData(response.data)
        } else {
          showError('Gagal memuat data profil')
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
        showError('Terjadi kesalahan saat memuat profil')
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, showError])

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { 
        label: 'Aktif', 
        icon: CheckCircle, 
        className: 'status-badge status-success' 
      },
      pending: { 
        label: 'Menunggu Pembayaran', 
        icon: Clock, 
        className: 'status-badge status-pending' 
      },
      expired: { 
        label: 'Kadaluarsa', 
        icon: XCircle, 
        className: 'status-badge status-expired' 
      },
      failed: { 
        label: 'Gagal', 
        icon: XCircle, 
        className: 'status-badge status-failed' 
      }
    }

    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon

    return (
      <span className={config.className}>
        <Icon size={14} />
        <span>{config.label}</span>
      </span>
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleRefresh = async () => {
    if (!user?.id) return

    setLoading(true)
    try {
      const response = await userService.getProfile(user.id)
      if (response.success) {
        setProfileData(response.data)
      }
    } catch (error) {
      console.error('Error refreshing profile:', error)
      showError('Gagal memperbarui data')
    } finally {
      setLoading(false)
    }
  }

  const handleResumePayment = async (order) => {
    if (!order || order.status !== 'pending') {
      showError('Order tidak dapat dilanjutkan')
      return
    }

    setProcessingOrder(order.order_id)

    try {
      const response = await paymentService.resumePayment(order.order_id)

      if (response.success && response.data?.snap_token) {
        showInfo('Membuka payment gateway...')

        // Open Midtrans Snap
        if (window.snap) {
          window.snap.pay(response.data.snap_token, {
            onSuccess: async (result) => {
              console.log('Payment success:', result)
              
              // Verify payment dari Midtrans dan update database
              try {
                await new Promise(resolve => setTimeout(resolve, 2000))
                const verifyResponse = await paymentService.verifyPayment(order.order_id)
                console.log('Payment verification:', verifyResponse)
              } catch (error) {
                console.error('Error verifying payment:', error)
              }
              
              showSuccess('Pembayaran berhasil!')
              setProcessingOrder(null)
              // Refresh profile data
              await handleRefresh()
            },
            onPending: (result) => {
              console.log('Payment pending:', result)
              showInfo('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.')
              setProcessingOrder(null)
              // Refresh profile data
              handleRefresh()
            },
            onError: (result) => {
              console.error('Payment error:', result)
              showError('Pembayaran gagal. Silakan coba lagi.')
              setProcessingOrder(null)
            },
            onClose: () => {
              console.log('Payment popup closed')
              showInfo('Anda menutup halaman pembayaran')
              setProcessingOrder(null)
            }
          })
        } else {
          showError('Midtrans Snap tidak tersedia. Pastikan script Midtrans sudah dimuat.')
          setProcessingOrder(null)
        }
      } else {
        showError(response.error || 'Gagal melanjutkan pembayaran')
        setProcessingOrder(null)
      }
    } catch (error) {
      console.error('Resume payment error:', error)
      showError('Terjadi kesalahan saat melanjutkan pembayaran')
      setProcessingOrder(null)
    }
  }

  const handleCancelPayment = async (order) => {
    if (!order || order.status !== 'pending') {
      showError('Order tidak dapat dibatalkan')
      return
    }

    // Confirm cancel
    if (!window.confirm('Apakah Anda yakin ingin membatalkan pembayaran ini?')) {
      return
    }

    setProcessingOrder(order.order_id)

    try {
      const response = await paymentService.cancelPayment(order.order_id)

      if (response.success) {
        showSuccess('Pembayaran berhasil dibatalkan')
        // Refresh profile data
        await handleRefresh()
      } else {
        showError(response.error || 'Gagal membatalkan pembayaran')
      }
    } catch (error) {
      console.error('Cancel payment error:', error)
      showError('Terjadi kesalahan saat membatalkan pembayaran')
    } finally {
      setProcessingOrder(null)
    }
  }

  if (loading && !profileData) {
    return (
      <div className="profile-loading">
        <div className="spinner"></div>
        <p>Memuat data profil...</p>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="profile-error">
        <p>Gagal memuat data profil</p>
        <button className="btn btn-primary" onClick={handleRefresh}>
          <RefreshCw size={18} />
          Coba Lagi
        </button>
      </div>
    )
  }

  return (
    <div className="profile-container">
      <div className="container">
        <div className="profile-header">
          <h1 className="profile-title">Profil Saya</h1>
          <button 
            className="btn btn-secondary btn-refresh"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw size={18} className={loading ? 'spinning' : ''} />
            {loading ? 'Memperbarui...' : 'Perbarui'}
          </button>
        </div>

        <div className="profile-content">
          {/* User Info Section */}
          <div className="profile-section">
            <div className="section-header">
              <User size={24} />
              <h2>Informasi Akun</h2>
            </div>
            <div className="info-card">
              <div className="info-row">
                <div className="info-icon">
                  <Mail size={20} />
                </div>
                <div className="info-content">
                  <label>Email</label>
                  <p>{profileData.user?.email || '-'}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon">
                  <Phone size={20} />
                </div>
                <div className="info-content">
                  <label>Nomor Telepon</label>
                  <p>{profileData.user?.phone || '-'}</p>
                </div>
              </div>
              <div className="info-row">
                <div className="info-icon">
                  <Calendar size={20} />
                </div>
                <div className="info-content">
                  <label>Bergabung Sejak</label>
                  <p>{formatDate(profileData.user?.created_at)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Active Package Section */}
          <div className="profile-section">
            <div className="section-header">
              <Package size={24} />
              <h2>Paket Aktif</h2>
            </div>
            {profileData.active_order ? (
              <div className="package-card active-package">
                <div className="package-header">
                  <div className="package-info">
                    <h3>{profileData.active_order.package_name}</h3>
                    {getStatusBadge(profileData.active_order.status)}
                  </div>
                  <div className="package-price">
                    <DollarSign size={20} />
                    <span>Rp {profileData.active_order.gross_amount?.toLocaleString('id-ID') || '0'}</span>
                  </div>
                </div>
                <div className="package-details">
                  <div className="package-detail-row">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value code">{profileData.active_order.order_id}</span>
                  </div>
                </div>
                <div className="package-badge-active">
                  <CheckCircle size={16} />
                  <span>Akses Penuh ke Semua Tools</span>
                </div>
              </div>
            ) : (
              <div className="package-card no-package">
                <div className="no-package-content">
                  <Package size={48} className="no-package-icon" />
                  <h3>Belum Ada Paket Aktif</h3>
                  <p>Berlangganan paket untuk mengakses semua tools dan fitur premium</p>
                </div>
              </div>
            )}
          </div>

          {/* Order History Section */}
          <div className="profile-section">
            <div className="section-header">
              <Calendar size={24} />
              <h2>Riwayat Pesanan</h2>
            </div>
            {profileData.order_history && profileData.order_history.length > 0 ? (
              <div className="orders-list">
                {profileData.order_history.map((order, index) => (
                  <div key={order.order_id || index} className="order-card">
                    <div className="order-header">
                      <div className="order-info">
                        <h4>{order.package_name}</h4>
                        <span className="order-id">Order ID: {order.order_id}</span>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>
                    <div className="order-details">
                      <div className="order-detail-item">
                        <DollarSign size={16} />
                        <span>Rp {order.gross_amount?.toLocaleString('id-ID') || '0'}</span>
                      </div>
                      <div className="order-detail-item">
                        <Calendar size={16} />
                        <span>{formatDate(order.created_at)}</span>
                      </div>
                    </div>
                    {order.status === 'pending' && (
                      <div className="order-actions">
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => handleResumePayment(order)}
                          disabled={processingOrder === order.order_id}
                        >
                          {processingOrder === order.order_id ? (
                            <>
                              <div className="spinner"></div>
                              Memproses...
                            </>
                          ) : (
                            <>
                              <CreditCard size={16} />
                              Lanjutkan Pembayaran
                            </>
                          )}
                        </button>
                        <button
                          className="btn btn-secondary btn-sm btn-cancel"
                          onClick={() => handleCancelPayment(order)}
                          disabled={processingOrder === order.order_id}
                        >
                          <X size={16} />
                          Batalkan Pembayaran
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-orders">
                <Calendar size={48} />
                <p>Belum ada riwayat pesanan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
