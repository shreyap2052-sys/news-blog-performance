import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const sampleRecords = [
  {
    id: 'rec-1',
    title: 'Optimize Hero Images for Mobile Devices',
    category: 'Images',
    priority: 'High',
    status: 'Completed',
    assignedStaff: 'Elena Rostova',
    description: 'Compress responsive images to WebP.',
  },
  {
    id: 'rec-2',
    title: 'Implement Edge Caching with Cloudflare Workers',
    category: 'Caching',
    priority: 'High',
    status: 'In Progress',
    assignedStaff: 'Marcus Vance',
    description: 'Cache static blog posts at edge locations.',
  },
  {
    id: 'rec-3',
    title: 'Preload Critical Fonts for Article Typography',
    category: 'Typography',
    priority: 'Medium',
    status: 'Pending',
    assignedStaff: 'Devon Reed',
    description: 'Add link rel=preload for Inter-Bold.woff2.',
  },
  {
    id: 'rec-4',
    title: 'Minify CSS and Inline Critical Rendering Path',
    category: 'CSS',
    priority: 'Low',
    status: 'Pending',
    assignedStaff: 'Aisha Patel',
    description: 'Inline above-the-fold CSS to eliminate render blocking.',
  },
]

describe('C. Search and Filtering Requirements', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(sampleRecords))
  })

  it('searches records by title (case-insensitive and partial match)', async () => {
    const user = userEvent.setup()
    render(<App />)

    const searchInput = await screen.findByRole('textbox', { name: /Search.*(Title|Record)?/i })

    // Search for "hero"
    await user.type(searchInput, 'hero')

    expect(screen.getByText('Optimize Hero Images for Mobile Devices')).toBeInTheDocument()
    expect(screen.queryByText('Implement Edge Caching with Cloudflare Workers')).not.toBeInTheDocument()
    expect(screen.queryByText('Preload Critical Fonts for Article Typography')).not.toBeInTheDocument()
    expect(screen.queryByText('Minify CSS and Inline Critical Rendering Path')).not.toBeInTheDocument()
  })

  it('filters records by status', async () => {
    const user = userEvent.setup()
    render(<App />)

    const statusFilter = await screen.findByLabelText(/Filter by (Status|State)|State Filter/i)

    // Filter by Completed
    await user.selectOptions(statusFilter, 'Completed')
    expect(screen.getByText('Optimize Hero Images for Mobile Devices')).toBeInTheDocument()
    expect(screen.queryByText('Implement Edge Caching with Cloudflare Workers')).not.toBeInTheDocument()
    expect(screen.queryByText('Preload Critical Fonts for Article Typography')).not.toBeInTheDocument()

    // Filter by In Progress
    await user.selectOptions(statusFilter, 'In Progress')
    expect(screen.queryByText('Optimize Hero Images for Mobile Devices')).not.toBeInTheDocument()
    expect(screen.getByText('Implement Edge Caching with Cloudflare Workers')).toBeInTheDocument()

    // Filter by Pending
    await user.selectOptions(statusFilter, 'Pending')
    expect(screen.getByText('Preload Critical Fonts for Article Typography')).toBeInTheDocument()
    expect(screen.getByText('Minify CSS and Inline Critical Rendering Path')).toBeInTheDocument()
  })

  it('filters records by priority', async () => {
    const user = userEvent.setup()
    render(<App />)

    const priorityFilter = await screen.findByLabelText(/Filter by Priority|Priority Filter/i)

    // Filter by Low
    await user.selectOptions(priorityFilter, 'Low')
    expect(screen.getByText('Minify CSS and Inline Critical Rendering Path')).toBeInTheDocument()
    expect(screen.queryByText('Optimize Hero Images for Mobile Devices')).not.toBeInTheDocument()
    expect(screen.queryByText('Preload Critical Fonts for Article Typography')).not.toBeInTheDocument()

    // Filter by High
    await user.selectOptions(priorityFilter, 'High')
    expect(screen.getByText('Optimize Hero Images for Mobile Devices')).toBeInTheDocument()
    expect(screen.getByText('Implement Edge Caching with Cloudflare Workers')).toBeInTheDocument()
    expect(screen.queryByText('Minify CSS and Inline Critical Rendering Path')).not.toBeInTheDocument()
  })

  it('combines title search, status filter, and priority filter simultaneously', async () => {
    const user = userEvent.setup()
    render(<App />)

    const searchInput = await screen.findByRole('textbox', { name: /Search/i })
    const statusFilter = screen.getByLabelText(/Filter by (Status|State)|State Filter/i)
    const priorityFilter = screen.getByLabelText(/Filter by Priority|Priority Filter/i)

    // Set search="Edge", status="In Progress", priority="High"
    await user.type(searchInput, 'Edge')
    await user.selectOptions(statusFilter, 'In Progress')
    await user.selectOptions(priorityFilter, 'High')

    expect(screen.getByText('Implement Edge Caching with Cloudflare Workers')).toBeInTheDocument()
    expect(screen.queryByText('Optimize Hero Images for Mobile Devices')).not.toBeInTheDocument()
  })

  it('displays "No data found" when search returns no matching records', async () => {
    const user = userEvent.setup()
    render(<App />)

    const searchInput = await screen.findByRole('textbox', { name: /Search/i })
    await user.type(searchInput, 'NonExistentOptimizationTopic123')

    expect(await screen.findByText(/No data found/i)).toBeInTheDocument()
    expect(screen.queryByText('Optimize Hero Images for Mobile Devices')).not.toBeInTheDocument()
  })

  it('displays "No data found" when filter combination yields zero records', async () => {
    const user = userEvent.setup()
    render(<App />)

    const statusFilter = await screen.findByLabelText(/Filter by (Status|State)|State Filter/i)
    const priorityFilter = screen.getByLabelText(/Filter by Priority|Priority Filter/i)

    // In sampleRecords, no record is status "Completed" AND priority "Low"
    await user.selectOptions(statusFilter, 'Completed')
    await user.selectOptions(priorityFilter, 'Low')

    expect(await screen.findByText(/No data found/i)).toBeInTheDocument()
  })

  it('resets the list when search query is cleared and filters are reset to All', async () => {
    const user = userEvent.setup()
    render(<App />)

    const searchInput = await screen.findByRole('textbox', { name: /Search/i })
    await user.type(searchInput, 'Fonts')
    expect(screen.getByText('Preload Critical Fonts for Article Typography')).toBeInTheDocument()
    expect(screen.queryByText('Optimize Hero Images for Mobile Devices')).not.toBeInTheDocument()

    // Clear search
    await user.clear(searchInput)
    expect(screen.getByText('Optimize Hero Images for Mobile Devices')).toBeInTheDocument()
    expect(screen.getByText('Implement Edge Caching with Cloudflare Workers')).toBeInTheDocument()
    expect(screen.getByText('Preload Critical Fonts for Article Typography')).toBeInTheDocument()
    expect(screen.getByText('Minify CSS and Inline Critical Rendering Path')).toBeInTheDocument()
  })
})
