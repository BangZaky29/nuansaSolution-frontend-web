import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Check, Zap, Crown, Sparkles } from 'lucide-react'
import './PricingPackages.css'

const PricingPackages = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState(null)

  const packages = [
    {
      id: 'paket-a',
      name: 'Paket A',
      price: 5000,
      icon: <Zap size={32} />,
      color: '#60A5FA',
      popular: false,
      features: [
        'Akses 5 Template Dokumen',
        'Konsultasi Email (3x)',
        'Berlaku 1 Bulan',
        'Support Dasar'
      ]
    },
    {
      id: 'paket-b',
      name: 'Paket B',
      price: 10000,
      icon: <Crown size={32} />,
      color: '#3B82F6',
      popular: true,
      features: [
        'Akses 15 Template Dokumen',
        'Konsultasi Email & Chat (10x)',
        'Berlaku 3 Bulan',
        'Support Prioritas',
        'Revisi Dokumen (2x)'
      ]
    },
    {
      id: 'paket-c',
      name: 'Paket C',
      price: 15000,
      icon: <Sparkles size={32} />,
      color: '#2563EB',
      popular: false,
      features: [
        'Akses Semua Template Dokumen',
        'Konsultasi Unlimited',
        'Berlaku 6 Bulan',
        'Support 24/7',
        'Revisi Dokumen Unlimited',
        'Konsultasi Video Call (2x)',
        'Prioritas Antrian'
      ]
    }
  ]

  const handleSelectPackage = (pkg) => {
  const safePackage = {
    id: pkg.id,
    name: pkg.name,
    price: pkg.price,
    popular: pkg.popular,
    features: pkg.features
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('selectedPackage', JSON.stringify(safePackage))
    navigate('/login?redirect=checkout')
  } else {
    navigate('/checkout', { state: { package: safePackage } })
  }
}


  return (
    <section className="pricing-section">
      <div className="container">
        <div className="pricing-header">
          <h2 className="section-title">Pilih Paket Layanan Anda</h2>
          <p className="section-description">
            Dapatkan akses ke berbagai dokumen legal dan layanan konsultasi sesuai kebutuhan Anda
          </p>
        </div>

        <div className="pricing-grid">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`pricing-card ${selectedPackage?.id === pkg.id ? 'selected' : ''} ${
                pkg.popular ? 'popular' : ''
              }`}
              onClick={() => setSelectedPackage(pkg)}
              style={{ '--package-color': pkg.color }}
            >
              {pkg.popular && <div className="popular-badge">Paling Populer</div>}

              <div className="pricing-icon" style={{ backgroundColor: pkg.color }}>
                {pkg.icon}
              </div>

              <h3 className="package-name">{pkg.name}</h3>

              <div className="package-price">
                <span className="currency">Rp</span>
                <span className="amount">{pkg.price.toLocaleString('id-ID')}</span>
              </div>

              <ul className="features-list">
                {pkg.features.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <Check size={18} className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn-select ${pkg.popular ? 'btn-popular' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectPackage(pkg)
                }}
              >
                {isAuthenticated ? 'Pilih Paket' : 'Login untuk Membeli'}
              </button>
            </div>
          ))}
        </div>

        <div className="pricing-note">
          <p>
            💡 <strong>Catatan:</strong> Anda harus memiliki akun dan login untuk dapat membeli paket layanan.
            Setelah pembayaran berhasil, akses akan aktif dalam 1x24 jam.
          </p>
        </div>
      </div>
    </section>
  )
}

export default PricingPackages