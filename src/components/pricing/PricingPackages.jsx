import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { Check, Zap, Crown, Sparkles, Rocket } from 'lucide-react'
import './PricingPackages.css'

const PricingPackages = () => {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [selectedPackage, setSelectedPackage] = useState(null)
  const [duration, setDuration] = useState(1)

  const durations = [
    { value: 1, label: '1 Bulan', discount: 0 },
    { value: 3, label: '3 Bulan', discount: 0.20 },
    { value: 6, label: '6 Bulan', discount: 0.30 },
    { value: 12, label: '1 Tahun', discount: 0.40 }
  ]

  const packages = useMemo(() => ([
    {
      id: 'paket-dasar',
      name: 'Paket Dasar',
      monthlyPrice: 15000,
      icon: <Zap size={32} />,
      color: '#60A5FA',
      badge: null,
      features: [
        'Akses Mandiri 3 Template Dokumen (Kuasa, Pernyataan, Permohonan)',
        'Konsultasi WhatsApp Official Nuansa Solution (Jam Kerja)',
        'Konsultasi Email Official Nuansa Solution (Jam Kerja)',
        'Masa berlaku: 1 Bulan'
      ]
    },
    {
      id: 'paket-premium',
      name: 'Paket Premium',
      monthlyPrice: 50000,
      icon: <Crown size={32} />,
      color: '#3B82F6',
      badge: 'Rekomendasi',
      features: [
        'Akses Mandiri Semua Template Dokumen (Generator Surat)',
        'Konsultasi WhatsApp Official Nuansa Solution (Jam Kerja)',
        'Konsultasi Email Official Nuansa Solution (Jam Kerja)',
        'Masa berlaku: 1 Bulan'
      ]
    },
    {
      id: 'paket-pro',
      name: 'Paket Pro',
      monthlyPrice: 100000,
      icon: <Sparkles size={32} />,
      color: '#2563EB',
      badge: null,
      features: [
        'Akses Mandiri Semua Template Dokumen (Surat, Invoice, Akuntansi)',
        'Konsultasi WhatsApp Official Nuansa Solution (Jam Kerja)',
        'Konsultasi Email Official Nuansa Solution (Jam Kerja)',
        'Masa berlaku: 1 Bulan'
      ]
    },
    {
      id: 'paket-auto-pilot',
      name: 'Paket Auto Pilot',
      monthlyPrice: 500000,
      icon: <Rocket size={32} />,
      color: '#0EA5E9',
      badge: 'Full Service',
      highlight: true,
      features: [
        'Akses Mandiri Semua Template Dokumen (Surat, Invoice, Akuntansi)',
        'Akses Auto Pilot Unlimited oleh Tim Profesional Nuansa Solution',
        'Full Support CS & Grup Private (Jam Kerja)',
        'Bantuan Pembuatan Surat, Invoice, Pencatatan Keuangan, & Desain Konten Sosial Media',
        'Konsultasi WhatsApp & Email Official',
        'Free Template Kop Surat',
        'Free Template ID Card (Direktur, Komisaris, Seluruh Karyawan)',
        'Free Design Brosur (2 pcs)',
        'Free Design Promosi Sosial Media (15 pcs)',
        'Masa berlaku: 1 Bulan'
      ]
    }
  ]), [])

  const handleSelectPackage = (pkg) => {
  const d = durations.find(x => x.value === duration) || durations[0]
  const { totalHarga, totalDiskon, hargaAkhir, discountRate } = getPricing(pkg.monthlyPrice)

  const formatDuration = (val) => (val === 12 ? '1 Tahun' : `${val} Bulan`)
  const durationLabel = formatDuration(d.value)

  const featuresWithDuration = pkg.features.map((f) => {
    return f.startsWith('Masa berlaku:') ? `Masa berlaku: ${durationLabel}` : f
  })

  const safePackage = {
    id: pkg.id,
    name: pkg.name,
    price: hargaAkhir,
    durationMonths: d.value,
    durationLabel,
    totalHarga,
    totalDiskon,
    hargaAkhir,
    discountRate,
    features: featuresWithDuration
  }

  if (!isAuthenticated) {
    sessionStorage.setItem('selectedPackage', JSON.stringify(safePackage))
    navigate('/login?redirect=checkout')
  } else {
    navigate('/checkout', { state: { package: safePackage } })
  }
}

  const getPricing = (monthlyPrice) => {
    const d = durations.find((x) => x.value === duration) || durations[0]
    const totalHarga = monthlyPrice * d.value
    const totalDiskon = totalHarga * d.discount
    const hargaAkhir = totalHarga - totalDiskon
    return { totalHarga, totalDiskon, hargaAkhir, discountRate: d.discount }
  }

  return (
    <section className="pricing-section">
      <div className="container">
        <div className="pricing-header">
          <h2 className="section-title">Pilih Paket Layanan Anda</h2>
          <p className="section-description">
            Dapatkan akses ke berbagai dokumen legal dan layanan konsultasi sesuai kebutuhan Anda
          </p>
          <div className="duration-selector" role="tablist" aria-label="Durasi berlangganan">
            {durations.map((d) => (
              <button
                key={d.value}
                className={`duration-tab ${duration === d.value ? 'active' : ''}`}
                onClick={() => setDuration(d.value)}
                role="tab"
                aria-selected={duration === d.value}
              >
                {d.label}
                {d.discount > 0 && <span className="discount-chip">{Math.round(d.discount * 100)}% OFF</span>}
              </button>
            ))}
          </div>
        </div>

        <div className="pricing-grid">
          {packages.map((pkg) => {
            const { totalHarga, totalDiskon, hargaAkhir, discountRate } = getPricing(pkg.monthlyPrice)
            const formatDuration = (val) => (val === 12 ? '1 Tahun' : `${val} Bulan`)
            const durationLabel = formatDuration(duration)
            const featuresToShow = pkg.features.map((f) =>
              f.startsWith('Masa berlaku:') ? `Masa berlaku: ${durationLabel}` : f
            )
            return (
            <div
              key={pkg.id}
              className={`pricing-card ${selectedPackage?.id === pkg.id ? 'selected' : ''} ${pkg.highlight ? 'popular' : ''}`}
              onClick={() => setSelectedPackage(pkg)}
              style={{ '--package-color': pkg.color }}
            >
              {pkg.badge && <div className="popular-badge">{pkg.badge}</div>}

              <div className="pricing-icon" style={{ backgroundColor: pkg.color }}>
                {pkg.icon}
              </div>

              <h3 className="package-name">{pkg.name}</h3>

              <div className="package-price">
                {discountRate > 0 && (
                  <div className="price-strike">Rp {totalHarga.toLocaleString('id-ID')}</div>
                )}
                <div className="price-final-text">Rp {hargaAkhir.toLocaleString('id-ID')}</div>
                {discountRate > 0 && (
                  <div className="price-discount">
                    Hemat Rp {Math.round(totalDiskon).toLocaleString('id-ID')}
                  </div>
                )}
              </div>

              <ul className="features-list">
                {featuresToShow.map((feature, index) => (
                  <li key={index} className="feature-item">
                    <Check size={18} className="check-icon" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                className={`btn-select ${pkg.highlight ? 'btn-popular' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelectPackage(pkg)
                }}
              >
                {isAuthenticated ? 'Berlangganan Sekarang' : 'Login untuk Membeli'}
              </button>
            </div>
          )})}
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
