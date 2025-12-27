import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { userService } from '../services/api'
import { useToast } from '../components/common/ToastContainer'
import { FileCheck, Calculator, Receipt, FileQuestion, Briefcase, Lock } from 'lucide-react'
import './Tools.css'
import {
  FileText,
  Wrench,
  Settings,
  HelpCircle,
  // tambahkan semua ikon lain yang digunakan di Tools.jsx
} from 'lucide-react';
const Tools = () => {
  const { isAuthenticated, user } = useAuth()
  const { showError } = useToast()
  const [hasAccess, setHasAccess] = useState(false)
  const [checkingAccess, setCheckingAccess] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      if (!isAuthenticated || !user?.id) {
        setHasAccess(false)
        return
      }

      setCheckingAccess(true)
      try {
        const response = await userService.checkAccess(user.id)
        setHasAccess(response.access === true)
      } catch (error) {
        setHasAccess(false)
      } finally {
        setCheckingAccess(false)
      }
    }

    checkAccess()

    const handleFocus = () => {
      if (isAuthenticated && user?.id) {
        checkAccess()
      }
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [isAuthenticated, user])

  const tools = [
    {
      id: 'surat-kuasa',
      title: 'Generator Surat Kuasa',
      description: 'Buat surat kuasa secara cepat dan mudah',
      icon: FileCheck,
      url: 'https://nuansasolution.id/surat-kuasa/'
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
    },
    {
      id: 'surat-jalan',
      title: 'Surat Jalan',
      description: 'Buat surat jalan resmi',
      icon: Briefcase,
      url: 'https://nuansasolution.id/surat-jalan/'
    },
    {
      id: 'invoice',
      title: 'Invoice',
      description: 'Buat invoice resmi',
      icon: FileText,
      url: 'https://nuansasolution.id/invoice/'
    }
  ]

  const handleToolClick = (tool) => {
    if (tool.isFree) {
      window.open(tool.url, '_blank')
      return
    }

    if (!isAuthenticated) {
      showError('Silakan login terlebih dahulu untuk mengakses tools')
      return
    }

    if (!hasAccess) {
      showError('Anda harus memiliki paket aktif untuk mengakses tools. Silakan berlangganan terlebih dahulu.')
      return
    }

    window.open(tool.url, '_blank')
  }

  return (
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
                style={{ cursor: canAccess ? 'pointer' : 'not-allowed' }}
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
                {!canAccess && !tool.isFree && (
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
  )
}

export default Tools
