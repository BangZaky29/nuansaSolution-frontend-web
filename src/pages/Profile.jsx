import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService, paymentService } from '../services/api'
import { useToast } from '../components/common/ToastContainer'
import { useNavigate } from 'react-router-dom'
import { User, Package, Calendar, CheckCircle, Clock, XCircle, RefreshCw, Mail, Phone, CreditCard, X, Download } from 'lucide-react'
import LogoImage from '../assets/NS_blank_02.png'
import './Profile.css'

const Profile = () => {
  const { user } = useAuth()
  const { showError, showSuccess, showInfo } = useToast()
  const navigate = useNavigate()
  const [profileData, setProfileData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [processingOrder, setProcessingOrder] = useState(null)
  const [downloading, setDownloading] = useState(null)

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

  const formatCurrency = (num) => {
    const n = Number(num || 0)
    return `Rp ${n.toLocaleString('id-ID')}`
  }

  const addMonths = (dateStr, months) => {
    if (!dateStr || !months) return null
    const d = new Date(dateStr)
    const end = new Date(d)
    end.setMonth(end.getMonth() + months)
    return end
  }

  const formatRange = (start, end) => {
    if (!start || !end) return '-'
    const s = new Date(start).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    const e = new Date(end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    return `${s} — ${e}`
  }

  const monthlyPriceMap = {
    'Paket Dasar': 15000,
    'Paket Premium': 50000,
    'Paket Pro': 100000,
    'Paket Auto Pilot': 500000
  }
  const durations = [
    { months: 1, discount: 0 },
    { months: 3, discount: 0.20 },
    { months: 6, discount: 0.30 },
    { months: 12, discount: 0.40 }
  ]

  const inferDurationMonths = (order) => {
    if (!order) return null
    if (order.duration_months) return Number(order.duration_months)
    const monthly = monthlyPriceMap[order.package_name]
    if (!monthly || !order.gross_amount) return null
    const amount = Math.round(Number(order.gross_amount))
    for (const d of durations) {
      const final = Math.round(monthly * d.months * (1 - d.discount))
      if (Math.abs(final - amount) <= 1) return d.months
    }
    return null
  }

  const getDurationLabel = (order) => {
    const m = inferDurationMonths(order)
    if (!m) return null
    const start = order.created_at
    const end = addMonths(start, m)
    const label = m === 12 ? '1 Tahun' : `${m} Bulan`
    return { label, start, end }
  }

  const getStatusNote = (order) => {
    if (!order) return null
    if (order.status === 'expired') {
      const info = getDurationLabel(order)
      const endText = info?.end ? new Date(info.end).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'
      return `Paket berakhir pada ${endText}`
    }
    if (order.status === 'failed' || order.status === 'cancelled') {
      const timeText = order.updated_at
        ? new Date(order.updated_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : formatDate(order.created_at)
      return `Paket dibatalkan pada ${timeText}`
    }
    return null
  }

  const downloadInvoice = async (order) => {
    if (!order) return
    setDownloading(order.order_id)
    try {
      const companyName = 'Nuansa Solution'
      const invoiceNumber = order.order_id
      const invoiceDate = formatDate(order.created_at)
      const customerEmail = profileData.user?.email || '-'
      const customerPhone = profileData.user?.phone || '-'
      const packageName = order.package_name
      const amount = formatCurrency(order.gross_amount)
      const statusLabel = order.status === 'paid' ? 'Aktif' : order.status === 'pending' ? 'Menunggu Pembayaran' : order.status === 'expired' ? 'Kadaluarsa' : 'Gagal'

      const html = `
      <!doctype html>
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Invoice ${invoiceNumber}</title>
        <style>
          @page { size: A4; margin: 20mm; }
          body { font-family: Arial, sans-serif; color: #111827; }
          .header { display:flex; justify-content:space-between; align-items:center; margin-bottom:24px; }
          .brand { display:flex; align-items:center; gap:12px; }
          .brand img { height:48px; }
          .brand .name { font-size:20px; font-weight:800; }
          .doc-title { font-size:24px; font-weight:900; }
          .meta { margin-top:8px; font-size:12px; color:#6B7280; }
          .section { border:1px solid #E5E7EB; border-radius:10px; padding:16px; margin-bottom:16px; }
          .section h3 { margin:0 0 12px 0; font-size:16px; font-weight:800; }
          .row { display:flex; justify-content:space-between; gap:12px; margin:6px 0; }
          .label { color:#6B7280; font-weight:700; font-size:12px; }
          .value { font-weight:700; font-size:14px; }
          .items { width:100%; border-collapse:collapse; margin-top:8px; }
          .items th, .items td { border:1px solid #E5E7EB; padding:10px; }
          .items th { background:#F9FAFB; text-align:left; font-size:12px; }
          .totals { margin-top:12px; display:flex; justify-content:flex-end; }
          .totals .amount { font-size:18px; font-weight:900; color:#1F2937; }
          .footer { margin-top:24px; font-size:12px; color:#6B7280; }
          .status { display:inline-block; padding:6px 10px; border-radius:999px; border:1px solid #E5E7EB; font-weight:800; font-size:12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="brand">
            <img src="${LogoImage}" alt="Nuansa Solution"/>
            <div class="name">${companyName}</div>
          </div>
          <div>
            <div class="doc-title">Invoice</div>
            <div class="meta">Nomor: ${invoiceNumber}</div>
            <div class="meta">Tanggal: ${invoiceDate}</div>
          </div>
        </div>

        <div class="section">
          <h3>Status</h3>
          <span class="status">${statusLabel}</span>
        </div>

        <div class="section">
          <h3>Tagihan Kepada</h3>
          <div class="row"><div class="label">Email</div><div class="value">${customerEmail}</div></div>
          <div class="row"><div class="label">Telepon</div><div class="value">${customerPhone}</div></div>
        </div>

        <div class="section">
          <h3>Detail Paket</h3>
          <table class="items">
            <thead>
              <tr><th>Paket</th><th>Jumlah</th><th>Harga</th></tr>
            </thead>
            <tbody>
              <tr><td>${packageName}</td><td>1</td><td>${amount}</td></tr>
            </tbody>
          </table>
          <div class="totals">
            <div class="amount">Total: ${amount}</div>
          </div>
        </div>

        <div class="section">
          <h3>Informasi Order</h3>
          <div class="row"><div class="label">Order ID</div><div class="value">${invoiceNumber}</div></div>
          <div class="row"><div class="label">Metode</div><div class="value">${order.payment_method || '-'}</div></div>
        </div>

        <div class="footer">
          Dokumen ini dibuat otomatis oleh sistem Nuansa Solution.
        </div>
        <script>
          window.onload = function() {
            window.focus();
            window.print();
            setTimeout(() => window.close(), 200);
          }
        </script>
      </body>
      </html>
      `
      const w = window.open('', '_blank')
      if (!w) {
        showError('Gagal membuka jendela invoice')
        setDownloading(null)
        return
      }
      w.document.open()
      w.document.write(html)
      w.document.close()
      showInfo('Membuka invoice untuk diunduh sebagai PDF')
    } catch (e) {
      showError('Gagal membuat invoice')
    } finally {
      setDownloading(null)
    }
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
                    <span>Rp {profileData.active_order.gross_amount?.toLocaleString('id-ID') || '0'}</span>
                  </div>
                </div>
                <div className="package-details">
                  <div className="package-detail-row">
                    <span className="detail-label">Order ID:</span>
                    <span className="detail-value code">{profileData.active_order.order_id}</span>
                  </div>
                  {(() => {
                    const info = getDurationLabel(profileData.active_order)
                    return info ? (
                      <div className="package-detail-row">
                        <span className="detail-label">Durasi:</span>
                        <span className="detail-value">{info.label} ({formatRange(info.start, info.end)})</span>
                      </div>
                    ) : null
                  })()}
                </div>
                <div className="package-badge-active">
                  <CheckCircle size={16} />
                  <span>Akses Penuh ke Semua Tools</span>
                </div>
                {getStatusNote(profileData.active_order) && (
                  <div className="order-status-info">
                    {getStatusNote(profileData.active_order)}
                  </div>
                )}
                <div className="invoice-action">
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => downloadInvoice(profileData.active_order)}
                    disabled={downloading === profileData.active_order.order_id}
                    title="Download Invoice (PDF)"
                  >
                    {downloading === profileData.active_order.order_id ? (
                      <>
                        <div className="spinner"></div>
                        Menyiapkan...
                      </>
                    ) : (
                      <>
                        <Download size={16} />
                        Download Invoice
                      </>
                    )}
                  </button>
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
                        <span>Rp {order.gross_amount?.toLocaleString('id-ID') || '0'}</span>
                      </div>
                     <div className="order-detail-item">
                       <Calendar size={16} />
                       <span>{formatDate(order.created_at)}</span>
                     </div>
                      {(() => {
                        const info = getDurationLabel(order)
                        return info ? (
                          <div className="order-detail-item">
                            <span>Durasi: {info.label}</span>
                            <span>{formatRange(info.start, info.end)}</span>
                          </div>
                        ) : null
                      })()}
                    </div>
                    <div className="invoice-action">
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => downloadInvoice(order)}
                        disabled={downloading === order.order_id || order.status === 'pending'}
                        title={order.status === 'pending' ? 'Invoice tersedia setelah pembayaran' : 'Download Invoice (PDF)'}
                      >
                        {downloading === order.order_id ? (
                          <>
                            <div className="spinner"></div>
                            Menyiapkan...
                          </>
                        ) : (
                          <>
                            <Download size={16} />
                            Download Invoice
                          </>
                        )}
                      </button>
                    </div>
                    {getStatusNote(order) && (
                      <div className="order-status-info">
                        {getStatusNote(order)}
                      </div>
                    )}
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
