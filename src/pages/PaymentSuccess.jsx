import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react'
import './PaymentStatus.css'

const PaymentSuccess = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  const orderId = location.state?.orderId
  const selectedPackage = location.state?.package

  useEffect(() => {
    // Auto redirect after 5 seconds
    if (countdown <= 0) return
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Use setTimeout to avoid setState during render
          setTimeout(() => {
            navigate('/')
          }, 0)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, countdown])

  return (
    <div className="payment-status-container">
      <div className="container">
        <div className="payment-status-card success">
          <div className="status-icon success-icon">
            <CheckCircle size={64} />
          </div>

          <h1 className="status-title">Pembayaran Berhasil!</h1>
          <p className="status-description">
            Terima kasih! Pembayaran Anda telah berhasil diproses.
            Akses ke layanan akan segera diaktifkan.
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

          <div className="status-actions">
            <button 
              className="btn btn-primary btn-large"
              onClick={() => navigate('/')}
            >
              <Home size={20} />
              Kembali ke Beranda
            </button>

            <button 
              className="btn btn-secondary btn-large"
              onClick={() => navigate('/profile')}
            >
              <ArrowRight size={20} />
              Lihat Profil
            </button>
          </div>

          <div className="auto-redirect">
            <p>Anda akan diarahkan otomatis dalam {countdown} detik...</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PaymentSuccess