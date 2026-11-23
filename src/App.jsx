import { useState, useEffect, useMemo, useCallback } from 'react'
import DashboardHeader from './components/DashboardHeader'
import OfflineBanner from './components/OfflineBanner'
import StorageAlert from './components/StorageAlert'
import LoadingIndicator from './components/LoadingIndicator'
import MetricsOverview from './components/MetricsOverview'
import SearchAndFilters from './components/SearchAndFilters'
import OptimizationForm from './components/OptimizationForm'
import OptimizationList from './components/OptimizationList'
import { loadStoredRecords, persistRecords } from './utils/storage'
import { sanitizeRecord } from './utils/security'
import { logAnalyticsInteraction } from './utils/analytics'
import { DEMO_OPTIMIZATION_RECORDS } from './data/demoRecords'
import './App.css'

export default function App() {
  const [records, setRecords] = useState(() => loadStoredRecords())
  const [isLoading, setIsLoading] = useState(true)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingRecord, setEditingRecord] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [priorityFilter, setPriorityFilter] = useState('All')
  const [storageError, setStorageError] = useState(null)

  // Handle async hydration / connection loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setRecords(loadStoredRecords())
      setIsLoading(false)
    }, 10)

    return () => clearTimeout(timer)
  }, [])

  // Derived metrics with useMemo for high performance
  const metrics = useMemo(() => {
    let completed = 0
    let pending = 0
    let inProgress = 0

    for (let i = 0; i < records.length; i += 1) {
      const status = records[i].status
      if (status === 'Completed') {
        completed += 1
      } else if (status === 'In Progress') {
        inProgress += 1
      } else if (status === 'Pending') {
        pending += 1
      }
    }

    return {
      total: records.length,
      completed,
      pending,
      inProgress,
    }
  }, [records])

  // Filtered records with useMemo
  const filteredRecords = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return records.filter((record) => {
      // Title search matching (case-insensitive)
      if (query && !record.title.toLowerCase().includes(query)) {
        return false
      }

      // Status filter
      if (statusFilter !== 'All' && record.status !== statusFilter) {
        return false
      }

      // Priority filter
      if (priorityFilter !== 'All' && record.priority !== priorityFilter) {
        return false
      }

      return true
    })
  }, [records, searchQuery, statusFilter, priorityFilter])

  const hasActiveFilters = Boolean(
    searchQuery.trim() !== '' || statusFilter !== 'All' || priorityFilter !== 'All'
  )

  // Stable event handlers with useCallback
  const handleToggleForm = useCallback(() => {
    setIsFormOpen((prev) => !prev)
    setEditingRecord(null)
  }, [])

  const handleStartEdit = useCallback((record) => {
    setEditingRecord(record)
    setIsFormOpen(true)
    // Scroll smoothly to form
    const formSection = document.getElementById('optimization-form-section')
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  const handleCancelForm = useCallback(() => {
    setIsFormOpen(false)
    setEditingRecord(null)
  }, [])

  const handleFormSubmit = useCallback(
    (formData) => {
      const sanitized = sanitizeRecord(formData)

      if (editingRecord) {
        // Edit existing record
        const updatedRecords = records.map((r) =>
          r.id === editingRecord.id ? { ...r, ...sanitized } : r
        )
        setRecords(updatedRecords)
        const result = persistRecords(updatedRecords)
        if (!result.success) {
          setStorageError(result.error)
        } else {
          setStorageError(null)
        }
        logAnalyticsInteraction()
      } else {
        // Add new record
        const newRecord = {
          ...sanitized,
          id: `opt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
          createdAt: new Date().toISOString(),
        }
        const updatedRecords = [newRecord, ...records]
        setRecords(updatedRecords)
        const result = persistRecords(updatedRecords)
        if (!result.success) {
          setStorageError(result.error)
        } else {
          setStorageError(null)
        }
        logAnalyticsInteraction()
      }

      setIsFormOpen(false)
      setEditingRecord(null)
    },
    [editingRecord, records]
  )

  const handleDeleteRecord = useCallback(
    (recordToDelete) => {
      const updatedRecords = records.filter((r) => r.id !== recordToDelete.id)
      setRecords(updatedRecords)
      const result = persistRecords(updatedRecords)
      if (!result.success) {
        setStorageError(result.error)
      } else {
        setStorageError(null)
      }
      logAnalyticsInteraction()
    },
    [records]
  )

  const handleResetFilters = useCallback(() => {
    setSearchQuery('')
    setStatusFilter('All')
    setPriorityFilter('All')
  }, [])

  const handleLoadDemo = useCallback(() => {
    setRecords(DEMO_OPTIMIZATION_RECORDS)
    persistRecords(DEMO_OPTIMIZATION_RECORDS)
    logAnalyticsInteraction()
  }, [])

  return (
    <div className="app-container">
      <OfflineBanner />
      <StorageAlert
        message={storageError}
        onDismiss={() => setStorageError(null)}
      />

      <DashboardHeader
        onToggleForm={handleToggleForm}
        isFormOpen={isFormOpen}
        onLoadDemo={handleLoadDemo}
        hasRecords={records.length > 0}
      />

      <main id="main-content" className="dashboard-main" role="main">
        {isLoading && <LoadingIndicator message="Loading optimization records..." />}

        <MetricsOverview metrics={metrics} />

        {isFormOpen && (
          <OptimizationForm
            key={editingRecord ? editingRecord.id : 'new-record-form'}
            initialData={editingRecord}
            onSubmit={handleFormSubmit}
            onCancel={handleCancelForm}
          />
        )}

        {!isFormOpen && (
          <SearchAndFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            priorityFilter={priorityFilter}
            onPriorityChange={setPriorityFilter}
            onReset={handleResetFilters}
            hasActiveFilters={hasActiveFilters}
          />
        )}

        <OptimizationList
          records={filteredRecords}
          onEdit={handleStartEdit}
          onDelete={handleDeleteRecord}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          onLoadDemo={handleLoadDemo}
        />
      </main>
    </div>
  )
}
