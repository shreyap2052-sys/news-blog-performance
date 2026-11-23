export default function OptimizationCard({ record, onEdit, onDelete }) {
  const { id, title, category, priority, status, assignedStaff, description, createdAt } = record

  const getPriorityClass = (p) => {
    switch (p?.toLowerCase()) {
      case 'high':
        return 'priority-high'
      case 'medium':
        return 'priority-medium'
      case 'low':
        return 'priority-low'
      default:
        return 'priority-default'
    }
  }

  const getStatusClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'completed':
        return 'status-completed'
      case 'in progress':
        return 'status-in-progress'
      case 'pending':
        return 'status-pending'
      default:
        return 'status-default'
    }
  }

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    : null

  return (
    <article
      id={`record-${id}`}
      className="record-card"
      aria-labelledby={`record-title-${id}`}
    >
      <div className="record-header">
        <div className="record-badges">
          <span className="badge category-badge">{category}</span>
          <span className={`badge priority-badge ${getPriorityClass(priority)}`}>
            {priority} Priority
          </span>
          <span className={`badge status-badge ${getStatusClass(status)}`}>
            {status}
          </span>
        </div>
        <div className="record-actions">
          <button
            type="button"
            className="action-btn edit-btn"
            onClick={() => onEdit(record)}
            aria-label={`Edit record: ${title}`}
          >
            Edit
          </button>
          <button
            type="button"
            className="action-btn delete-btn"
            onClick={() => onDelete(record)}
            aria-label={`Delete record: ${title}`}
          >
            Delete
          </button>
        </div>
      </div>

      <h3 id={`record-title-${id}`} className="record-title">
        {title}
      </h3>

      <p className="record-description">{description}</p>

      <div className="record-footer">
        <div className="record-staff">
          <span className="staff-label">Assigned: </span>
          <span className="staff-name">{assignedStaff}</span>
        </div>
        {formattedDate && (
          <div className="record-date">
            <time dateTime={createdAt}>{formattedDate}</time>
          </div>
        )}
      </div>
    </article>
  )
}
