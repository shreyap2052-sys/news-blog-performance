export default function SearchAndFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  onReset,
  hasActiveFilters,
}) {
  return (
    <section className="controls-section" aria-label="Search and Filter Controls">
      <div className="controls-grid">
        <div className="control-group search-group">
          <label htmlFor="search-input" className="control-label">
            Search optimization records
          </label>
          <div className="search-input-wrapper">
            <input
              id="search-input"
              type="text"
              role="textbox"
              className="control-input search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search optimization records (e.g. Hero, Caching, CSS)..."
              aria-label="Search optimization records"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => onSearchChange('')}
                aria-label="Clear title search"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="control-group filter-group">
          <label htmlFor="status-filter" className="control-label">
            Filter by state
          </label>
          <select
            id="status-filter"
            className="control-select"
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            aria-label="Filter by state"
          >
            <option value="All">All States</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="control-group filter-group">
          <label htmlFor="priority-filter" className="control-label">
            Filter by Priority
          </label>
          <select
            id="priority-filter"
            className="control-select"
            value={priorityFilter}
            onChange={(e) => onPriorityChange(e.target.value)}
            aria-label="Filter by Priority"
          >
            <option value="All">All Priorities</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>

        <div className="control-group reset-group">
          <button
            type="button"
            className="btn btn-secondary reset-btn"
            onClick={onReset}
            disabled={!hasActiveFilters}
            aria-label="Reset all search and filters"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </section>
  )
}
