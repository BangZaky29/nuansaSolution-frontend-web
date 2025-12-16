import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Scale, FileText, Users, Shield } from 'lucide-react'
import PricingPackages from '../components/pricing/PricingPackages'
import './Home.css'

const Home = () => {
  const { isAuthenticated, user } = useAuth()

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