import OptimizationCard from './OptimizationCard'
import EmptyState from './EmptyState'

export default function OptimizationList({ records, onEdit, onDelete, onResetFilters, hasActiveFilters, onLoadDemo }) {
  if (records.length === 0) {
    return (
      <section className="records-section" aria-label="Optimization Records">
        <EmptyState
          message="No data found"
          subMessage={
            hasActiveFilters
              ? 'No optimization initiatives match the current search or filter criteria.'
              : 'There are currently no optimization records in the registry.'
          }
          onAction={hasActiveFilters ? onResetFilters : onLoadDemo}
          actionText={hasActiveFilters ? 'Clear Filters' : 'Load Demo Records'}
        />
      </section>
    )
  }

  return (
    <section className="records-section" aria-label="Optimization Records">
      <div className="records-count-bar">
        <span className="records-count-text">
          Showing <strong>{records.length}</strong> {records.length === 1 ? 'initiative' : 'initiatives'}
        </span>
      </div>
      <div className="records-grid" role="list">
        {records.map((record) => (
          <div key={record.id} role="listitem">
            <OptimizationCard
              record={record}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    </section>
  )
}
