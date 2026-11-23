export default function MetricsOverview({ metrics }) {
  const { total, completed, pending, inProgress } = metrics

  return (
    <section className="metrics-section" aria-label="Performance Optimization Metrics">
      <div className="metrics-grid">
        <article
          className="metric-card metric-card-total"
          data-testid="metric-total"
          aria-label={`Total Optimization Records: ${total}`}
        >
          <div className="metric-header">
            <span className="metric-title">Total Records</span>
            <span className="metric-badge">All</span>
          </div>
          <div className="metric-value">{total}</div>
          <p className="metric-description">Total tracked optimization initiatives</p>
        </article>

        <article
          className="metric-card metric-card-completed"
          data-testid="metric-completed"
          aria-label={`Completed Optimizations: ${completed}`}
        >
          <div className="metric-header">
            <span className="metric-title">Completed</span>
            <span className="metric-status-badge status-completed">Done</span>
          </div>
          <div className="metric-value">{completed}</div>
          <p className="metric-description">Successfully deployed to production</p>
        </article>

        <article
          className="metric-card metric-card-in-progress"
          data-testid="metric-in-progress"
          aria-label={`In Progress Optimizations: ${inProgress}`}
        >
          <div className="metric-header">
            <span className="metric-title">In Progress</span>
            <span className="metric-status-badge status-in-progress">Active</span>
          </div>
          <div className="metric-value">{inProgress}</div>
          <p className="metric-description">Currently under active engineering</p>
        </article>

        <article
          className="metric-card metric-card-pending"
          data-testid="metric-pending"
          aria-label={`Pending Optimizations: ${pending}`}
        >
          <div className="metric-header">
            <span className="metric-title">Pending</span>
            <span className="metric-status-badge status-pending">Queued</span>
          </div>
          <div className="metric-value">{pending}</div>
          <p className="metric-description">Queued in backlog for investigation</p>
        </article>
      </div>
    </section>
  )
}
