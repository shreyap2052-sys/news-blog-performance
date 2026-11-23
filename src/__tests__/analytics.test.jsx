import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

const existingRecord = {
  id: 'analytics-1',
  title: 'Enable HTTP/2 Server Push for Key CSS',
  category: 'Networking',
  priority: 'High',
  status: 'In Progress',
  assignedStaff: 'Elena Rostova',
  description: 'Initiate push streams for critical CSS resources.',
}

const EXACT_ANALYTICS_MESSAGE = '[Analytics] User interacted with Performance Optimization'

describe('F. Analytics Requirements', () => {
  let consoleSpy

  beforeEach(() => {
    localStorage.clear()
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('logs exact analytics message when a new record is successfully added', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    await user.type(screen.getByLabelText(/Title/i), 'Compress SVG Icons via SVGO')
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Asset Optimization')
    await user.selectOptions(screen.getByLabelText(/Priority/i), 'Medium')
    await user.type(screen.getByLabelText(/Assigned Staff/i), 'Tariq Vance')
    await user.type(
      screen.getByLabelText(/Description/i),
      'Remove metadata and simplify SVG paths in the iconography sprite sheet.'
    )

    await user.click(screen.getByRole('button', { name: /Save Record|Add Record|Submit/i }))

    expect(consoleSpy).toHaveBeenCalledWith(EXACT_ANALYTICS_MESSAGE)
  })

  it('logs exact analytics message when an existing record is successfully edited', async () => {
    const user = userEvent.setup()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify([existingRecord]))
    render(<App />)

    const editBtn = await screen.findByRole('button', { name: /Edit.*HTTP\/2 Server Push/i })
    await user.click(editBtn)

    const statusSelect = screen.getByLabelText(/Status/i)
    await user.selectOptions(statusSelect, 'Completed')

    const saveBtn = screen.getByRole('button', { name: /Update Record|Save Record|Save Changes/i })
    await user.click(saveBtn)

    expect(consoleSpy).toHaveBeenCalledWith(EXACT_ANALYTICS_MESSAGE)
  })

  it('logs exact analytics message when a record is successfully deleted', async () => {
    const user = userEvent.setup()
    localStorage.setItem('news_blog_optimization_records', JSON.stringify([existingRecord]))
    render(<App />)

    const deleteBtn = await screen.findByRole('button', { name: /Delete.*HTTP\/2 Server Push/i })
    await user.click(deleteBtn)

    const confirmBtn = screen.queryByRole('button', { name: /Confirm|Yes, Delete|Delete/i })
    if (confirmBtn && confirmBtn !== deleteBtn) {
      await user.click(confirmBtn)
    }

    expect(consoleSpy).toHaveBeenCalledWith(EXACT_ANALYTICS_MESSAGE)
  })

  it('does NOT log analytics message when an action fails validation', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    // Attempt to submit empty form
    const submitBtn = screen.getByRole('button', { name: /Save Record|Add Record|Submit/i })
    await user.click(submitBtn)

    expect(consoleSpy).not.toHaveBeenCalledWith(EXACT_ANALYTICS_MESSAGE)
  })
})
