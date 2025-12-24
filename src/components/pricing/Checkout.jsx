import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from "../../context/AuthContext";
import { useToast } from "../common/ToastContainer";
import { paymentService } from "../../services/api";
import { CreditCard, Check, ArrowLeft, AlertCircle, Loader } from 'lucide-react'
import './Checkout.css'

const Checkout = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const { showSuccess, showError, showInfo } = useToast()

  const [selectedPackage, setSelectedPackage] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState('va_bca')
  const [loading, setLoading] = useState(false)
  const [processingPayment, setProcessingPayment] = useState(false)

  useEffect(() => {
    // Cek apakah user sudah login
    if (!isAuthenticated) {
      navigate('/login?redirect=checkout')
      return
    }

    // Ambil package dari state navigation atau sessionStorage
    const pkg = location.state?.package || JSON.parse(sessionStorage.getItem('selectedPackage') || 'null')
    
    if (!pkg) {
      showError('Pilih paket terlebih dahulu')
      navigate('/')
      return
    }

    setSelectedPackage(pkg)
    // Clear sessionStorage setelah digunakan
    sessionStorage.removeItem('selectedPackage')
  }, [isAuthenticated, location, navigate, showError])

  const paymentMethods = [
    { id: 'va_bca', name: 'BCA Virtual Account', icon: '🏦' },
    { id: 'qris', name: 'QRIS', icon: '📱' }
  ]

  const handlePayment = async () => {
    if (!selectedPackage) {
      showError('Paket tidak valid')
      return
    }

    setLoading(true)
    setProcessingPayment(true)

    try {
      // 1. Create payment order
      const response = await paymentService.createPayment(
        user.id,
        selectedPackage.name,
        selectedPackage.price,
        paymentMethod
      )

      if (response.success && response.data.snap_token) {
        showInfo('Membuka payment gateway...')

        // 2. Open Midtrans Snap
        window.snap.pay(response.data.snap_token, {
          onSuccess: async (result) => {
            console.log('Payment success:', result)
            
            // Verify payment status dari Midtrans dan update database
            try {
              // Wait a bit for webhook to process (if it comes)
              await new Promise(resolve => setTimeout(resolve, 2000))
              
              // Verify payment dari Midtrans dan update database
              const verifyResponse = await paymentService.verifyPayment(response.data.order_id)
              console.log('Payment verification:', verifyResponse)
              
              if (verifyResponse.success) {
                console.log('Payment verified and database updated')
              }
            } catch (error) {
              console.error('Error verifying payment:', error)
              // Continue anyway, user can check status manually
            }
            
            showSuccess('Pembayaran berhasil! Akses Anda akan aktif segera.')
            
            // Redirect ke halaman success
            navigate('/payment-success', { 
              state: { 
                orderId: response.data.order_id,
                package: selectedPackage 
              } 
            })
          },
          
          onPending: (result) => {
            console.log('Payment pending:', result)
            showInfo('Pembayaran tertunda. Silakan selesaikan pembayaran Anda.')
            
            setTimeout(() => {
              navigate('/payment-pending', { 
                state: { 
                  orderId: response.data.order_id,
                  package: selectedPackage 
                } 
              })
            }, 1500)
          },
          
          onError: (result) => {
            console.error('Payment error:', result)
            showError('Pembayaran gagal. Silakan coba lagi.')
            setProcessingPayment(false)
          },
          
          onClose: () => {
            console.log('Payment popup closed')
            showInfo('Anda menutup halaman pembayaran')
            setProcessingPayment(false)
          }
        })
      } else {
        showError(response.error || 'Gagal membuat pembayaran')
      }
    } catch (error) {
      console.error('Checkout error:', error)
      showError('Terjadi kesalahan saat memproses pembayaran')
    } finally {
      setLoading(false)
    }
  }

  if (!selectedPackage) {
    return (
      <div className="checkout-loading">
        <Loader size={48} className="spinner-icon" />
        <p>Memuat data paket...</p>
      </div>
    )
  }

  return (
    <div className="checkout-container">
      <div className="container">
        <button className="btn-back" onClick={() => navigate('/')}>
          <ArrowLeft size={20} />
          Kembali
        </button>

        <div className="checkout-content">
          {/* Package Summary */}
          <div className="checkout-summary">
            <h2 className="checkout-title">Ringkasan Pesanan</h2>
            
            <div className="package-summary-card">
              <div className="package-header">
                <h3>{selectedPackage.name}</h3>
                <div className="package-price-big">
                  Rp {selectedPackage.price.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="package-features">
                <h4>Yang Anda Dapatkan:</h4>
                <ul>
                  {selectedPackage.features.map((feature, index) => (
                    <li key={index}>
                      <Check size={16} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* User Info */}
            <div className="user-info-card">
              <h4>Informasi Akun</h4>
              <div className="user-details">
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{user.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Telepon:</span>
                  <span className="value">{user.phone}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Method */}
          <div className="checkout-payment">
            <h2 className="checkout-title">Metode Pembayaran</h2>
            
            <div className="payment-methods">
              {paymentMethods.map((method) => (
                <label
                  key={method.id}
                  className={`payment-method-card ${
                    paymentMethod === method.id ? 'selected' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method.id}
                    checked={paymentMethod === method.id}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <span className="method-icon">{method.icon}</span>
                  <span className="method-name">{method.name}</span>
                  {paymentMethod === method.id && (
                    <Check size={20} className="check-mark" />
                  )}
                </label>
              ))}
            </div>

            {/* Payment Info */}
            <div className="payment-info">
              <AlertCircle size={18} />
              <p>
                Anda akan diarahkan ke halaman pembayaran Midtrans yang aman.
                Pastikan menyelesaikan pembayaran dalam waktu yang ditentukan.
              </p>
            </div>

            {/* Total & Pay Button */}
            <div className="checkout-footer">
              <div className="total-section">
                <span className="total-label">Total Pembayaran:</span>
                <span className="total-amount">
                  Rp {selectedPackage.price.toLocaleString('id-ID')}
                </span>
              </div>

              <button
                className="btn-pay"
                onClick={handlePayment}
                disabled={loading || processingPayment}
              >
                {loading ? (
                  <>
                    <Loader size={20} className="spinner-icon" />
                    Memproses...
                  </>
                ) : processingPayment ? (
                  <>
                    <Loader size={20} className="spinner-icon" />
                    Menunggu Pembayaran...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Bayar Sekarang
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout