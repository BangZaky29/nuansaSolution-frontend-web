import PropTypes from 'prop-types'
import './Button.css'

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  icon = null,
  fullWidth = false,
  ...props
}) => {
  const baseClass = 'ui-button'
  const variantClass = `ui-button--${variant}`
  const sizeClass = `ui-button--${size}`
  const fullWidthClass = fullWidth ? 'ui-button--full' : ''
  const disabledClass = disabled || loading ? 'ui-button--disabled' : ''

  const classes = [
    baseClass,
    variantClass,
    sizeClass,
    fullWidthClass,
    disabledClass,
    className
  ].filter(Boolean).join(' ')

  return (
    <button
      type={type}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <span className="ui-button__spinner"></span>}
      {!loading && icon && <span className="ui-button__icon">{icon}</span>}
      <span className="ui-button__text">{children}</span>
    </button>
  )
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary', 'outline', 'ghost', 'danger']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
  onClick: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  className: PropTypes.string,
  icon: PropTypes.node,
  fullWidth: PropTypes.bool
}

export default Button
