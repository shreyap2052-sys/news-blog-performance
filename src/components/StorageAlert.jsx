export default function StorageAlert({ message, onDismiss }) {
  if (!message) {
    return null
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="storage-alert"
    >
      <div className="alert-content">
        <strong className="alert-title">Storage Warning: </strong>
        <span>{message}</span>
      </div>
      {onDismiss && (
        <button
          type="button"
          className="alert-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss storage warning alert"
        >
          ×
        </button>
      )}
    </div>
  )
}
