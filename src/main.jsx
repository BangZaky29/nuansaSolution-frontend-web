import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'
import { ToastProvider } from './components/common/ToastContainer.jsx'

const snapUrl = import.meta.env.VITE_MIDTRANS_SNAP_URL || 'https://app.sandbox.midtrans.com/snap/snap.js'
const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY
if (clientKey) {
  const s = document.createElement('script')
  s.src = snapUrl
  s.setAttribute('data-client-key', clientKey)
  document.head.appendChild(s)
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </AuthProvider>
  </React.StrictMode>,
)
