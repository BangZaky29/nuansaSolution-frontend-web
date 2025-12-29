import { forwardRef } from 'react'
import PropTypes from 'prop-types'
import './Input.css'

const Input = forwardRef(({
  label,
  error,
  helperText,
  required = false,
  disabled = false,
  fullWidth = true,
  icon,
  iconPosition = 'left',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const inputId = props.id || props.name
  const hasError = !!error

  return (
    <div className={`ui-input-container ${fullWidth ? 'ui-input-container--full' : ''} ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="ui-input-label">
          {label}
          {required && <span className="ui-input-required">*</span>}
        </label>
      )}

      <div className="ui-input-wrapper">
        {icon && iconPosition === 'left' && (
          <span className="ui-input-icon ui-input-icon--left">{icon}</span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={`ui-input ${hasError ? 'ui-input--error' : ''} ${icon ? `ui-input--with-icon-${iconPosition}` : ''} ${className}`}
          disabled={disabled}
          aria-invalid={hasError}
          aria-describedby={hasError ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
          {...props}
        />

        {icon && iconPosition === 'right' && (
          <span className="ui-input-icon ui-input-icon--right">{icon}</span>
        )}
      </div>

      {hasError && (
        <p id={`${inputId}-error`} className="ui-input-error">
          {error}
        </p>
      )}

      {!hasError && helperText && (
        <p id={`${inputId}-helper`} className="ui-input-helper">
          {helperText}
        </p>
      )}
    </div>
  )
})

Input.displayName = 'Input'

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  helperText: PropTypes.string,
  required: PropTypes.bool,
  disabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  icon: PropTypes.node,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  className: PropTypes.string,
  containerClassName: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string
}

export default Input
