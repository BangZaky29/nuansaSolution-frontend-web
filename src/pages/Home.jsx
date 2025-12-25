import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scale, FileText, Users, Shield, FileCheck, Calculator, Receipt, FileQuestion, Briefcase, Lock } from 'lucide-react'
import PricingPackages from '../components/pricing/PricingPackages'
import './Home.css'
import './Tools.css'
import { useEffect, useState } from 'react'
import { userService } from '../services/api'
import { useToast } from '../components/common/ToastContainer'

const Home = () => {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const { showError } = useToast()
  const [hasAccess, setHasAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated || !user?.id) {
        setHasAccess(false)
        return
      }
      try {
        const resp = await userService.checkAccess(user.id)
        setHasAccess(resp?.access === true)
      } catch {
        setHasAccess(false)
      }
    }
    checkAccess()
    const onFocus = () => checkAccess()
    window.addEventListener('focus', onFocus)
    return () => window.removeEventListener('focus', onFocus)
  }, [isAuthenticated, user?.id])

  const tools = [
    {
      id: 'surat-kuasa',
      title: 'Generator Surat Kuasa',
      description: 'Buat surat kuasa secara cepat dan mudah',
      icon: FileCheck,
      url: 'https://nuansasolution.id/surat-kuasa/'
    },
    {
      id: 'calculator-pph',
      title: 'Kalkulator PPh',
      description: 'Hitung Pajak Penghasilan dengan mudah',
      icon: Calculator,
      url: 'https://nuansasolution.id/calculator-PPH/',
      isFree: true
    },
    {
      id: 'calculator-properti',
      title: 'Kalkulator Pajak Properti',
      description: 'Hitung pajak properti Anda',
      icon: Calculator,
      url: 'https://nuansasolution.id/kalkulator-pajak-properti/',
      isFree: true
    },
    {
      id: 'surat-pernyataan',
      title: 'Surat Pernyataan',
      description: 'Buat surat pernyataan resmi',
      icon: Receipt,
      url: 'https://nuansasolution.id/surat-pernyataan/'
    },
    {
      id: 'surat-permohonan',
      title: 'Surat Permohonan',
      description: 'Buat surat permohonan formal',
      icon: FileQuestion,
      url: 'https://nuansasolution.id/surat-permohonan/'
    },
    {
      id: 'surat-perintah-kerja',
      title: 'Surat Perintah Kerja',
      description: 'Buat surat perintah kerja',
      icon: Briefcase,
      url: 'https://nuansasolution.id/surat-perintah-kerja/'
    }
  ]

  const handleToolClick = (tool) => {
    const canAccess = tool.isFree || (isAuthenticated && hasAccess)
    if (!canAccess) {
      showError('Anda memerlukan paket aktif untuk mengakses tool ini.')
      return
    }
    window.open(tool.url, '_blank')
  }

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Solusi Legal Terpercaya untuk Bisnis Anda
            </h1>
            <p className="hero-description">
              Platform layanan hukum modern yang membantu Anda mengelola 
              dokumen legal, konsultasi, dan berbagai kebutuhan hukum 
              dengan mudah dan efisien.
            </p>
            <div className="hero-buttons">
              {isAuthenticated ? (
                <Link to="/dashboard" className="btn btn-primary btn-large">
                  Buka Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn btn-primary btn-large">
                    Daftar Sekarang
                  </Link>
                  <Link to="/login" className="btn btn-secondary btn-large">
                    Masuk
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Layanan Kami</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Scale size={40} />
              </div>
              <h3>Konsultasi Hukum</h3>
              <p>Dapatkan konsultasi hukum dari para ahli berpengalaman untuk berbagai kebutuhan legal Anda.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FileText size={40} />
              </div>
              <h3>Dokumen Legal</h3>
              <p>Akses template dokumen legal standar dan buat dokumen sesuai kebutuhan bisnis Anda.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Users size={40} />
              </div>
              <h3>Tim Profesional</h3>
              <p>Tim lawyer dan legal expert yang siap membantu menyelesaikan masalah hukum Anda.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Shield size={40} />
              </div>
              <h3>Keamanan Terjamin</h3>
              <p>Data dan informasi Anda dijamin aman dengan sistem enkripsi tingkat enterprise.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section (Web Layanan) */}
      <section className="tools">
        <div className="container">
          <h2 className="section-title">Web Layanan</h2>
          <div className="tools-grid">
            {tools.map((tool) => {
              const Icon = tool.icon
              const canAccess = tool.isFree || (isAuthenticated && hasAccess)
              return (
                <div
                  key={tool.id}
                  className={`tool-card ${!canAccess ? 'locked' : ''}`}
                  onClick={() => handleToolClick(tool)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="tool-icon">
                    {canAccess ? (
                      <Icon size={40} />
                    ) : (
                      <Lock size={40} />
                    )}
                  </div>
                  <h3>{tool.title}</h3>
                  <p>{tool.description}</p>
                  {!canAccess && (
                    <div className="tool-lock-badge">
                      <Lock size={16} />
                      <span>Diperlukan Paket Aktif</span>
                    </div>
                  )}
                  {tool.isFree && (
                    <div className="tool-free-badge">
                      <span>Gratis</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Pricing Packages Section */}
      <PricingPackages />

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta">
          <div className="container">
            <div className="cta-content">
              <h2>Siap Memulai?</h2>
              <p>Bergabunglah dengan ribuan bisnis yang telah mempercayakan kebutuhan legal mereka kepada kami.</p>
              <Link to="/register" className="btn btn-primary btn-large">
                Daftar Gratis
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home
