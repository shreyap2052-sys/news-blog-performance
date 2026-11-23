export default function LoadingIndicator({ message = 'Loading optimization records...' }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className="loading-indicator"
    >
      <div className="spinner" aria-hidden="true" />
      <span className="loading-text">{message}</span>
    </div>
  )
}
