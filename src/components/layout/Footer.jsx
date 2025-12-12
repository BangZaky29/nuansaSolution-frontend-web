import { Link } from 'react-router-dom'
import { Mail, Phone, MapPin } from 'lucide-react'
import './Footer.css'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-section">
            <h3 className="footer-title">Nuansa Legal</h3>
            <p className="footer-description">
              Platform layanan legal terpercaya untuk membantu Anda dalam 
              berbagai kebutuhan hukum dengan mudah dan cepat.
            </p>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Tautan Cepat</h4>
            <ul className="footer-links">
              <li><Link to="/">Beranda</Link></li>
              <li><Link to="/layanan">Layanan</Link></li>
              <li><Link to="/tentang">Tentang Kami</Link></li>
              <li><Link to="/kontak">Kontak</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Legal</h4>
            <ul className="footer-links">
              <li><Link to="/syarat">Syarat & Ketentuan</Link></li>
              <li><Link to="/privasi">Kebijakan Privasi</Link></li>
              <li><Link to="/faq">FAQ</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-section">
            <h4 className="footer-subtitle">Hubungi Kami</h4>
            <ul className="footer-contact">
              <li>
                <Mail size={18} />
                <span>info@nuansalegal.com</span>
              </li>
              <li>
                <Mail size={18} />
                <span>info@nuansaSolution.com</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+62 812-3456-7890</span>
              </li>
              <li>
                <MapPin size={18} />
                <span>Jakarta, Indonesia</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>&copy; {currentYear} Nuansa Legal. All rights reserved.</p>
          <p>Made with ❤️ in Indonesia</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer