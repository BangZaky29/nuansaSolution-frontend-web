import PropTypes from 'prop-types'
import './Card.css'

const Card = ({
  children,
  title,
  subtitle,
  headerAction,
  footer,
  hoverable = false,
  clickable = false,
  onClick,
  className = '',
  bodyClassName = '',
  padding = 'default',
  ...props
}) => {
  const hasHeader = title || subtitle || headerAction

  const cardClasses = [
    'ui-card',
    hoverable && 'ui-card--hoverable',
    clickable && 'ui-card--clickable',
    `ui-card--padding-${padding}`,
    className
  ].filter(Boolean).join(' ')

  const CardWrapper = clickable ? 'button' : 'div'
  const wrapperProps = clickable ? { type: 'button', onClick } : {}

  return (
    <CardWrapper className={cardClasses} {...wrapperProps} {...props}>
      {hasHeader && (
        <div className="ui-card__header">
          <div className="ui-card__header-content">
            {title && <h3 className="ui-card__title">{title}</h3>}
            {subtitle && <p className="ui-card__subtitle">{subtitle}</p>}
          </div>
          {headerAction && (
            <div className="ui-card__header-action">{headerAction}</div>
          )}
        </div>
      )}

      <div className={`ui-card__body ${bodyClassName}`}>
        {children}
      </div>

      {footer && (
        <div className="ui-card__footer">
          {footer}
        </div>
      )}
    </CardWrapper>
  )
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  headerAction: PropTypes.node,
  footer: PropTypes.node,
  hoverable: PropTypes.bool,
  clickable: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  bodyClassName: PropTypes.string,
  padding: PropTypes.oneOf(['none', 'sm', 'default', 'lg'])
}

export default Card
