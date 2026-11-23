import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import App from '../App'

const mockRecords = [
  {
    id: 'opt-101',
    title: 'Convert Hero Images to AVIF/WebP',
    category: 'Image Optimization',
    priority: 'High',
    status: 'Completed',
    assignedStaff: 'Elena Rostova',
    description: 'Compress and serve next-gen image formats with responsive srcset to reduce Largest Contentful Paint (LCP).',
  },
  {
    id: 'opt-102',
    title: 'Implement Route-Based Code Splitting',
    category: 'Code Splitting',
    priority: 'High',
    status: 'In Progress',
    assignedStaff: 'Marcus Vance',
    description: 'Use React.lazy and dynamic imports for article viewer and comments section to reduce initial JavaScript bundle size.',
  },
  {
    id: 'opt-103',
    title: 'Configure Stale-While-Revalidate CDN Caching',
    category: 'Caching',
    priority: 'Medium',
    status: 'Pending',
    assignedStaff: 'Devon Reed',
    description: 'Set Cache-Control headers with s-maxage=60, stale-while-revalidate=600 for breaking news feeds.',
  },
  {
    id: 'opt-104',
    title: 'Defer Third-Party Ad and Tracking Scripts',
    category: 'Third-Party Scripts',
    priority: 'Low',
    status: 'Pending',
    assignedStaff: 'Aisha Patel',
    description: 'Load non-critical analytics and marketing SDKs asynchronously to minimize Total Blocking Time (TBT).',
  },
]

describe('A. Dashboard Requirements', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('renders the dashboard header and main title', async () => {
    render(<App />)

    const mainHeading = await screen.findByRole('heading', {
      name: /News Blog.*Performance Optimization/i,
      level: 1,
    })
    expect(mainHeading).toBeInTheDocument()
  })

  it('displays total optimization records count', async () => {
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(mockRecords))
    render(<App />)

    // Summary card / section for total records
    const totalMetric = await screen.findByTestId('metric-total')
    expect(totalMetric).toBeInTheDocument()
    expect(within(totalMetric).getByText(/4/)).toBeInTheDocument()
    expect(within(totalMetric).getByText(/Total Records|Total Optimizations/i)).toBeInTheDocument()
  })

  it('displays completed, pending, and in-progress counts accurately', async () => {
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(mockRecords))
    render(<App />)

    // Completed metric (mock has 1 completed)
    const completedMetric = await screen.findByTestId('metric-completed')
    expect(within(completedMetric).getByText(/1/)).toBeInTheDocument()
    expect(within(completedMetric).getByText(/Completed/i)).toBeInTheDocument()

    // Pending metric (mock has 2 pending)
    const pendingMetric = await screen.findByTestId('metric-pending')
    expect(within(pendingMetric).getByText(/2/)).toBeInTheDocument()
    expect(within(pendingMetric).getByText(/Pending/i)).toBeInTheDocument()

    // In Progress metric (mock has 1 in-progress)
    const inProgressMetric = await screen.findByTestId('metric-in-progress')
    expect(within(inProgressMetric).getByText(/1/)).toBeInTheDocument()
    expect(within(inProgressMetric).getByText(/In Progress/i)).toBeInTheDocument()
  })

  it('displays all optimization records with title, category, priority, status, assigned staff and description', async () => {
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(mockRecords))
    render(<App />)

    for (const record of mockRecords) {
      expect(await screen.findByText(record.title)).toBeInTheDocument()
      expect(screen.getByText(record.category)).toBeInTheDocument()
      expect(screen.getByText(record.assignedStaff)).toBeInTheDocument()
      expect(screen.getByText(record.description)).toBeInTheDocument()
    }
  })

  it('displays "No data found" when optimization records list is empty', async () => {
    localStorage.setItem('news_blog_optimization_records', JSON.stringify([]))
    render(<App />)

    const emptyNotice = await screen.findByText(/No data found/i)
    expect(emptyNotice).toBeInTheDocument()

    // Counts should all show 0
    const totalMetric = screen.getByTestId('metric-total')
    expect(within(totalMetric).getByText(/0/)).toBeInTheDocument()
  })
})
