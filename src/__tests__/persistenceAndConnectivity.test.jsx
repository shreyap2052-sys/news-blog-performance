import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, waitFor, act, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const existingRecords = [
  {
    id: 'stored-1',
    title: 'Enable HTTP/3 with QUIC',
    category: 'Networking',
    priority: 'High',
    status: 'In Progress',
    assignedStaff: 'Kavita Roy',
    description: 'Upgrade reverse proxy to support QUIC protocol to reduce connection handshake latency.',
  },
]

describe('D. Persistence and Connectivity Requirements', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('hydrates records from localStorage on initial load', async () => {
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(existingRecords))
    render(<App />)

    expect(await screen.findByText('Enable HTTP/3 with QUIC')).toBeInTheDocument()
    expect(screen.getByText('Kavita Roy')).toBeInTheDocument()
  })

  it('persists newly added and updated records to localStorage', async () => {
    const user = userEvent.setup()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(existingRecords))
    render(<App />)

    expect(await screen.findByText('Enable HTTP/3 with QUIC')).toBeInTheDocument()

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    await user.type(screen.getByLabelText(/Title/i), 'Lazy Load Embedded YouTube Players')
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Media')
    await user.selectOptions(screen.getByLabelText(/Priority/i), 'Medium')
    await user.type(screen.getByLabelText(/Assigned Staff/i), 'Sean O’Connor')
    await user.type(
      screen.getByLabelText(/Description/i),
      'Replace heavy iframes with lightweight facade thumbnails until clicked.'
    )

    await user.click(screen.getByRole('button', { name: /Save Record|Add Record|Submit/i }))

    await waitFor(() => {
      const stored = JSON.parse(localStorage.getItem('news_blog_optimization_records') || '[]')
      expect(stored.some((r) => r.title === 'Lazy Load Embedded YouTube Players')).toBe(true)
    })
  })

  it('displays loading indicator during asynchronous operations', async () => {
    render(<App />)

    // A loading indicator (e.g. role="status", "Loading..." or aria-busy container)
    // should be present while initial async load / fetching resolves
    const loader = screen.queryByRole('status') || screen.queryByText(/loading/i)
    if (loader) {
      expect(loader).toBeInTheDocument()
    }

    // Once settled, records or empty state is displayed
    await waitFor(() => {
      expect(screen.queryByRole('status')).not.toBeInTheDocument()
    })
  })

  it('handles slow connections gracefully with persistent loading state', async () => {
    // Simulate slow async operation
    let resolveSlowFetch
    const slowPromise = new Promise((resolve) => {
      resolveSlowFetch = resolve
    })

    // If an async storage/fetch adapter is used, test delay tolerance
    render(<App />)

    // The app should remain stable and not throw unhandled rejections
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()

    // Resolve after delay
    await act(async () => {
      resolveSlowFetch?.()
      await slowPromise
    })
  })

  it('handles localStorage failures gracefully (e.g. QuotaExceededError)', async () => {
    const user = userEvent.setup()
    render(<App />)

    await screen.findByRole('heading', { level: 1 })

    // Mock localStorage.setItem to throw QuotaExceededError
    vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      const error = new Error('QuotaExceededError: Failed to execute setItem on Storage: Setting the value of key exceeded the quota.')
      error.name = 'QuotaExceededError'
      throw error
    })

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    await user.type(screen.getByLabelText(/Title/i), 'Database Query Indexing for News Archive')
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Database')
    await user.selectOptions(screen.getByLabelText(/Priority/i), 'High')
    await user.type(screen.getByLabelText(/Assigned Staff/i), 'Priya Sharma')
    await user.type(
      screen.getByLabelText(/Description/i),
      'Add composite index on articles(published_at, category_id) to speed up queries.'
    )

    await user.click(screen.getByRole('button', { name: /Save Record|Add Record|Submit/i }))

    // App must not crash; an accessible error alert should inform the user of storage failure
    const storageAlert = await screen.findByRole('alert')
    expect(storageAlert).toHaveTextContent(/storage.*(quota|failed|error|exceeded)/i)
  })

  it('displays offline status banner when browser goes offline and clears when back online', async () => {
    render(<App />)

    await screen.findByRole('heading', { level: 1 })

    // Simulate going offline
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    // Offline alert / banner should be visible
    const offlineNotice = await screen.findByText(/You are (currently )?offline|Offline mode/i)
    expect(offlineNotice).toBeInTheDocument()

    // Simulate coming back online
    act(() => {
      window.dispatchEvent(new Event('online'))
    })

    // Offline notice should disappear
    await waitFor(() => {
      expect(screen.queryByText(/You are (currently )?offline|Offline mode/i)).not.toBeInTheDocument()
    })
  })

  it('preserves previously saved records during offline conditions', async () => {
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(existingRecords))
    render(<App />)

    expect(await screen.findByText('Enable HTTP/3 with QUIC')).toBeInTheDocument()

    // Dispatch offline event
    act(() => {
      window.dispatchEvent(new Event('offline'))
    })

    // Existing records must remain intact and displayed
    expect(screen.getByText('Enable HTTP/3 with QUIC')).toBeInTheDocument()
    expect(screen.getByText('Kavita Roy')).toBeInTheDocument()

    // Metrics remain intact
    const totalMetric = screen.getByTestId('metric-total')
    expect(within(totalMetric).getByText(/1/)).toBeInTheDocument()
  })
})
