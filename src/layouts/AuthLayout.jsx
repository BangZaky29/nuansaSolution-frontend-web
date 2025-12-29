import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import './AuthLayout.css'

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout__header">
        <Link to="/" className="auth-layout__logo">
          <img src="/NS_blank_03.png" alt="Nuansa Solution" />
        </Link>
      </div>

      <div className="auth-layout__content">
        {(title || subtitle) && (
          <div className="auth-layout__text">
            {title && <h1 className="auth-layout__title">{title}</h1>}
            {subtitle && <p className="auth-layout__subtitle">{subtitle}</p>}
          </div>
        )}
        <div className="auth-layout__card">
          {children}
        </div>
      </div>

      <div className="auth-layout__footer">
        <p>&copy; 2022 Nuansa Solution. All rights reserved.</p>
      </div>
    </div>
  )
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string
}

export default AuthLayout
