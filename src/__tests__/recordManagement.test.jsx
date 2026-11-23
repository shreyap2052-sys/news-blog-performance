import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const initialRecord = {
  id: 'opt-201',
  title: 'Purge Unused CSS Rules',
  category: 'Asset Optimization',
  priority: 'Medium',
  status: 'Pending',
  assignedStaff: 'Jordan Lee',
  description: 'Run PurgeCSS during production build to eliminate 45KB of unused styling.',
}

describe('B. Record Management Requirements', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a new optimization record with title, category, priority, assigned staff and description', async () => {
    const user = userEvent.setup()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify([initialRecord]))
    render(<App />)

    // Open Add Record form if behind a button, or find form fields directly
    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    const titleInput = screen.getByLabelText(/Title/i)
    const categoryInput = screen.getByLabelText(/Category/i)
    const priorityInput = screen.getByLabelText(/Priority/i)
    const staffInput = screen.getByLabelText(/Assigned Staff/i)
    const descriptionInput = screen.getByLabelText(/Description/i)
    const submitBtn = screen.getByRole('button', { name: /Save Record|Add Record|Submit/i })

    await user.type(titleInput, 'Enable Brotli Compression on Nginx')
    await user.selectOptions(categoryInput, 'Server / CDN')
    await user.selectOptions(priorityInput, 'High')
    await user.type(staffInput, 'Maya Lin')
    await user.type(descriptionInput, 'Enable brotli static and dynamic compression for HTML, CSS, and JS responses.')

    await user.click(submitBtn)

    // Verify record is added to the list
    expect(await screen.findByText('Enable Brotli Compression on Nginx')).toBeInTheDocument()
    expect(screen.getByText('Maya Lin')).toBeInTheDocument()
    expect(screen.getByText('Server / CDN')).toBeInTheDocument()

    // Verify total records metric incremented from 1 to 2
    const totalMetric = screen.getByTestId('metric-total')
    expect(within(totalMetric).getByText(/2/)).toBeInTheDocument()
  })

  it('edits an existing optimization record', async () => {
    const user = userEvent.setup()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify([initialRecord]))
    render(<App />)

    // Find and click the edit button for initialRecord
    const editBtn = await screen.findByRole('button', { name: /Edit.*Purge Unused CSS/i })
    await user.click(editBtn)

    // Verify form is populated with record details
    const titleInput = screen.getByLabelText(/Title/i)
    expect(titleInput).toHaveValue(initialRecord.title)

    // Update title, status to 'Completed', and priority to 'High'
    await user.clear(titleInput)
    await user.type(titleInput, 'Purge Unused CSS Rules via PostCSS')

    const statusSelect = screen.getByLabelText(/Status/i)
    await user.selectOptions(statusSelect, 'Completed')

    const saveBtn = screen.getByRole('button', { name: /Update Record|Save Record|Save Changes/i })
    await user.click(saveBtn)

    // Updated title should now appear
    expect(await screen.findByText('Purge Unused CSS Rules via PostCSS')).toBeInTheDocument()
    expect(screen.queryByText('Purge Unused CSS Rules')).not.toBeInTheDocument()

    // Completed metric should have updated from 0 to 1
    const completedMetric = screen.getByTestId('metric-completed')
    expect(within(completedMetric).getByText(/1/)).toBeInTheDocument()
  })

  it('deletes an optimization record and decreases total count', async () => {
    const user = userEvent.setup()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify([initialRecord]))
    render(<App />)

    expect(await screen.findByText(initialRecord.title)).toBeInTheDocument()

    const deleteBtn = screen.getByRole('button', { name: /Delete.*Purge Unused CSS/i })
    await user.click(deleteBtn)

    // If confirmation dialog exists, confirm deletion
    const confirmBtn = screen.queryByRole('button', { name: /Confirm|Yes, Delete|Delete/i })
    if (confirmBtn && confirmBtn !== deleteBtn) {
      await user.click(confirmBtn)
    }

    // Record should be removed and empty state shown
    expect(screen.queryByText(initialRecord.title)).not.toBeInTheDocument()
    expect(screen.getByText(/No data found/i)).toBeInTheDocument()

    const totalMetric = screen.getByTestId('metric-total')
    expect(within(totalMetric).getByText(/0/)).toBeInTheDocument()
  })

  it('validates required fields and displays accessible error messages', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    const submitBtn = screen.getByRole('button', { name: /Save Record|Add Record|Submit/i })
    await user.click(submitBtn)

    // Accessible error messages must be present
    const alerts = await screen.findAllByRole('alert')
    expect(alerts.length).toBeGreaterThanOrEqual(1)

    // Expected required error messages
    expect(screen.getByText(/Title is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Category is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Assigned Staff is required/i)).toBeInTheDocument()
    expect(screen.getByText(/Description is required/i)).toBeInTheDocument()
  })

  it('highlights invalid fields in red with aria-invalid="true"', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    const submitBtn = screen.getByRole('button', { name: /Save Record|Add Record|Submit/i })
    await user.click(submitBtn)

    const titleInput = screen.getByLabelText(/Title/i)
    const staffInput = screen.getByLabelText(/Assigned Staff/i)
    const descriptionInput = screen.getByLabelText(/Description/i)

    // Must have aria-invalid="true"
    expect(titleInput).toHaveAttribute('aria-invalid', 'true')
    expect(staffInput).toHaveAttribute('aria-invalid', 'true')
    expect(descriptionInput).toHaveAttribute('aria-invalid', 'true')

    // Must be highlighted in red (via class containing error/invalid/red or style border-color)
    const isRedHighlighted = (element) => {
      const className = element.className || ''
      const style = element.getAttribute('style') || ''
      return (
        /invalid|error|border-red|red/i.test(className) ||
        /border.*(red|rgb\(2(?:2[0-9]|3[0-9]|4[0-9]|5[0-5]),|#f)/i.test(style)
      )
    }

    expect(isRedHighlighted(titleInput)).toBe(true)
    expect(isRedHighlighted(staffInput)).toBe(true)
    expect(isRedHighlighted(descriptionInput)).toBe(true)
  })

  it('validates malformed and whitespace-only inputs', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    const titleInput = screen.getByLabelText(/Title/i)
    const staffInput = screen.getByLabelText(/Assigned Staff/i)
    const descriptionInput = screen.getByLabelText(/Description/i)
    const submitBtn = screen.getByRole('button', { name: /Save Record|Add Record|Submit/i })

    // Input whitespace only or invalid strings
    await user.type(titleInput, '   ab   ')
    await user.type(staffInput, '1234#$')
    await user.type(descriptionInput, '   ')

    await user.click(submitBtn)

    // Form should reject short/whitespace title, invalid staff name, and empty description
    expect(screen.getByText(/Title must be at least 3 characters|Invalid title/i)).toBeInTheDocument()
    expect(screen.getByText(/Invalid staff name|Staff name must contain letters/i)).toBeInTheDocument()
    expect(screen.getByText(/Description is required|Description cannot be empty/i)).toBeInTheDocument()

    // No record created
    const totalMetric = screen.getByTestId('metric-total')
    expect(within(totalMetric).getByText(/0/)).toBeInTheDocument()
  })

  it('removes invalid highlight and error message once valid input is entered', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    const titleInput = screen.getByLabelText(/Title/i)
    const submitBtn = screen.getByRole('button', { name: /Save Record|Add Record|Submit/i })

    // Trigger validation error
    await user.click(submitBtn)
    expect(titleInput).toHaveAttribute('aria-invalid', 'true')

    // Now type valid input
    await user.type(titleInput, 'Minify JavaScript Bundles')
    expect(titleInput).toHaveAttribute('aria-invalid', 'false')
    expect(screen.queryByText(/Title is required/i)).not.toBeInTheDocument()
  })
})
