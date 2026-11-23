import PropTypes from 'prop-types'

export default function EmptyState({ message = 'No data found', subMessage, onAction, actionText }) {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        📋
      </div>
      <h3 className="empty-title">{message}</h3>
      {subMessage && <p className="empty-subtitle">{subMessage}</p>}
      {onAction && actionText && (
        <button
          type="button"
          className="btn btn-secondary empty-action-btn"
          onClick={onAction}
        >
          {actionText}
        </button>
      )}
    </div>
  )
}

EmptyState.propTypes = {
  message: PropTypes.string,
  subMessage: PropTypes.string,
  onAction: PropTypes.func,
  actionText: PropTypes.string,
}
