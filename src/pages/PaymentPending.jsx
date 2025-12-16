import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clock, Package, RefreshCw, Home, AlertCircle } from 'lucide-react'
import { paymentService } from '../services/api'
import { useToast } from '../components/common/ToastContainer'
import './PaymentStatus.css'

const PaymentPending = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { showSuccess, showError } = useToast()

  const [checking, setChecking] = useState(false)
  const orderId = location.state?.orderId
  const selectedPackage = location.state?.package

  const handleCheckStatus = async () => {
    if (!orderId) {
      showError('Order ID tidak ditemukan')
      return
    }

    setChecking(true)

    try {
      const response = await paymentService.checkStatus(orderId)

      if (response.success) {
        const status = response.data.transaction_status

        switch (status) {
          case 'settlement':
          case 'capture':
            showSuccess('Pembayaran berhasil!')
            setTimeout(() => {
              navigate('/payment-success', { state: location.state })
            }, 1000)
            break
          case 'pending':
            showError('Pembayaran masih tertunda. Silakan selesaikan pembayaran Anda.')
            break
          case 'deny':
          case 'cancel':
          case 'expire':
            showError('Pembayaran dibatalkan atau kadaluarsa')
            setTimeout(() => {
              navigate('/')
            }, 2000)
            break
          default:
            showError('Status pembayaran tidak diketahui')
        }
      } else {
        showError(response.error || 'Gagal memeriksa status pembayaran')
      }
    } catch (error) {
      showError('Terjadi kesalahan saat memeriksa status')
    } finally {
      setChecking(false)
    }
  }

  // Auto check every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (orderId) {
        handleCheckStatus()
      }
    }, 10000) // Check every 10 seconds

    return () => clearInterval(interval)
  }, [orderId])

  return (
    <div className="payment-status-container">
      <div className="container">
        <div className="payment-status-card pending">
          <div className="status-icon pending-icon">
            <Clock size={64} />
          </div>

          <h1 className="status-title">Pembayaran Tertunda</h1>
          <p className="status-description">
            Pembayaran Anda masih dalam proses. Silakan selesaikan pembayaran
            sesuai dengan instruksi yang diberikan.
          </p>

          {selectedPackage && (
            <div className="order-summary">
              <div className="summary-header">
                <Package size={24} />
                <h3>Detail Paket</h3>
              </div>

              <div className="summary-content">
                <div className="summary-row">
                  <span className="label">Paket:</span>
                  <span className="value">{selectedPackage.name}</span>
                </div>
                <div className="summary-row">
                  <span className="label">Harga:</span>
                  <span className="value">
                    Rp {selectedPackage.price.toLocaleString('id-ID')}
                  </span>
                </div>
                {orderId && (
                  <div className="summary-row">
                    <span className="label">Order ID:</span>
                    <span className="value code">{orderId}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="pending-info">
            <AlertCircle size={20} />
            <div>
              <p className="info-title">Penting!</p>
              <p className="info-text">
                Selesaikan pembayaran Anda dalam waktu yang ditentukan.
                Pembayaran akan otomatis dibatalkan jika melewati batas waktu.
              </p>
            </div>
          </div>

          <div className="status-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={handleCheckStatus}
              disabled={checking}
            >
              {checking ? (
                <>
                  <RefreshCw size={20} className="spinner-icon" />
                  Memeriksa...
                </>
              ) : (
                <>
                  <RefreshCw size={20} />
                  Cek Status Pembayaran
                </>
              )}
            </button>

            <button 
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/')}
            >
              <Home size={20} />
              Kembali ke Beranda
            </button>
          </div>

          <div className="auto-check">
            <p>Status pembayaran akan diperiksa otomatis setiap 10 detik</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentPending