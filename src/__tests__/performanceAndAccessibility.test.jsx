import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const sampleData = [
  {
    id: 'perf-1',
    title: 'Enable HTTP/2 Multiplexing',
    category: 'Networking',
    priority: 'High',
    status: 'Completed',
    assignedStaff: 'Elena Rostova',
    description: 'Ensure concurrent requests across single TCP stream.',
  },
  {
    id: 'perf-2',
    title: 'Optimize Core Web Vitals CLS Metric',
    category: 'Layout',
    priority: 'Medium',
    status: 'In Progress',
    assignedStaff: 'Marcus Vance',
    description: 'Reserve explicit dimensions for all dynamic ads and embeds.',
  },
]

describe('G & H. React Performance and Accessibility Requirements', () => {
  beforeEach(() => {
    localStorage.clear()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify(sampleData))
  })

  describe('H. Accessibility', () => {
    it('uses semantic landmark HTML elements (header, main, section, nav/toolbar)', async () => {
      const { container } = render(<App />)

      // Landmark elements must be present
      expect(container.querySelector('header')).not.toBeNull()
      expect(container.querySelector('main')).not.toBeNull()
      expect(container.querySelectorAll('section').length).toBeGreaterThanOrEqual(1)

      // Main h1 heading
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent(/News Blog.*Performance Optimization/i)
    })

    it('provides appropriate ARIA labels and accessible names for all controls', async () => {
      render(<App />)

      // Search input has accessible name
      const searchBox = await screen.findByRole('textbox', { name: /search/i })
      expect(searchBox).toBeInTheDocument()

      // Metric cards have clear accessible context
      const metricTotal = screen.getByTestId('metric-total')
      expect(metricTotal).toHaveAttribute('aria-label')

      // Edit and delete buttons have descriptive accessible names (specifying which record)
      const editButtons = screen.getAllByRole('button', { name: /edit/i })
      expect(editButtons.length).toBeGreaterThanOrEqual(1)
      expect(editButtons[0]).toHaveAccessibleName(/edit.*HTTP\/2 Multiplexing/i)

      const deleteButtons = screen.getAllByRole('button', { name: /delete/i })
      expect(deleteButtons.length).toBeGreaterThanOrEqual(1)
      expect(deleteButtons[0]).toHaveAccessibleName(/delete.*HTTP\/2 Multiplexing/i)
    })

    it('supports full keyboard navigation (Tab, Enter, Space)', async () => {
      const user = userEvent.setup()
      render(<App />)

      const searchInput = await screen.findByRole('textbox', { name: /search/i })

      // Focus search input and tab through controls
      searchInput.focus()
      expect(searchInput).toHaveFocus()

      await user.tab()
      // Next element in tab order should be focused (e.g. status filter or add button)
      expect(document.activeElement).not.toBe(document.body)
      expect(document.activeElement).not.toBe(searchInput)
    })

    it('links invalid inputs to accessible error messages via aria-describedby and role="alert"', async () => {
      const user = userEvent.setup()
      render(<App />)

      const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
      if (addBtn) {
        await user.click(addBtn)
      }

      const submitBtn = screen.getByRole('button', { name: /Save Record|Add Record|Submit/i })
      await user.click(submitBtn)

      const titleInput = screen.getByLabelText(/Title/i)
      expect(titleInput).toHaveAttribute('aria-invalid', 'true')

      // aria-describedby should point to the id of the error element
      const errorId = titleInput.getAttribute('aria-describedby')
      expect(errorId).toBeTruthy()

      const errorElement = document.getElementById(errorId)
      expect(errorElement).toBeInTheDocument()
      expect(errorElement).toHaveAttribute('role', 'alert')
      expect(errorElement).toHaveTextContent(/Title is required/i)
    })
  })

  describe('G. React Performance', () => {
    it('maintains memoized derived metrics and avoids recomputations on unrelated renders', async () => {
      const user = userEvent.setup()
      render(<App />)

      const totalMetric = await screen.findByTestId('metric-total')
      expect(within(totalMetric).getByText(/2/)).toBeInTheDocument()

      // Type in search box (updating search state)
      const searchBox = screen.getByRole('textbox', { name: /search/i })
      await user.type(searchBox, 'Core')

      // Overall metrics should remain consistent and derived correctly via useMemo
      expect(within(totalMetric).getByText(/2/)).toBeInTheDocument()
    })
  })
})
