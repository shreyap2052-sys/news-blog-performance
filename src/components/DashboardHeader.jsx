export default function DashboardHeader({ onToggleForm, isFormOpen, onLoadDemo, hasRecords }) {
  return (
    <header className="dashboard-header" role="banner">
      <div className="header-brand">
        <div className="header-badge">Enterprise Web Vitals</div>
        <h1 className="header-title">News Blog – Performance Optimization Dashboard</h1>
        <p className="header-subtitle">
          Monitor, coordinate, and track mission-critical Core Web Vitals, asset compression, CDN caching, and bundle optimizations across the news publication platform.
        </p>
      </div>
      <div className="header-actions">
        {!hasRecords && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onLoadDemo}
            aria-label="Load demo performance optimization records"
          >
            Load Demo Data
          </button>
        )}
        <button
          type="button"
          className="btn btn-primary"
          onClick={onToggleForm}
          aria-expanded={isFormOpen}
          aria-controls="optimization-form-section"
          aria-label={isFormOpen ? 'Close optimization record form' : 'Add New Optimization Record'}
        >
          {isFormOpen ? 'Cancel' : 'Add New Record'}
        </button>
      </div>
    </header>
  )
}
