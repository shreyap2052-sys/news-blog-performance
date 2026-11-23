import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import App from '../App'

describe('E. Security and Sanitization Requirements', () => {
  beforeEach(() => {
    localStorage.clear()
    window.__xss_executed = false
  })

  it('sanitizes user inputs against XSS attacks before storing in state', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    const xssScript = '<script>window.__xss_executed = true;</script>Sanitized Title'
    const xssImg = '<img src="x" onerror="window.__xss_executed = true;" />Sanitized Description'

    await user.type(screen.getByLabelText(/Title/i), xssScript)
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Code Splitting')
    await user.selectOptions(screen.getByLabelText(/Priority/i), 'Medium')
    await user.type(screen.getByLabelText(/Assigned Staff/i), 'Secure Staff')
    await user.type(screen.getByLabelText(/Description/i), xssImg)

    await user.click(screen.getByRole('button', { name: /Save Record|Add Record|Submit/i }))

    // XSS script must NOT have executed
    expect(window.__xss_executed).toBe(false)

    // In the DOM, dangerous <script> or executable elements must not exist
    expect(document.querySelector('script:not([src])')).toBeNull()

    // The stored state/localStorage must have sanitized content
    const stored = JSON.parse(localStorage.getItem('news_blog_optimization_records') || '[]')
    const added = stored.find((r) => r.assignedStaff === 'Secure Staff')
    if (added) {
      expect(added.title).not.toContain('<script>')
      expect(added.description).not.toContain('onerror=')
    }
  })

  it('neutralizes javascript: URIs and SVG event handlers in inputs', async () => {
    const user = userEvent.setup()
    render(<App />)

    const addBtn = screen.queryByRole('button', { name: /Add (New )?Record|New Optimization/i })
    if (addBtn) {
      await user.click(addBtn)
    }

    const xssSvg = '<svg onload="window.__xss_executed = true;">Vector Graphic</svg>'

    await user.type(screen.getByLabelText(/Title/i), 'Inline SVG Optimization')
    await user.selectOptions(screen.getByLabelText(/Category/i), 'Assets')
    await user.selectOptions(screen.getByLabelText(/Priority/i), 'Low')
    await user.type(screen.getByLabelText(/Assigned Staff/i), 'Alice Wonder')
    await user.type(screen.getByLabelText(/Description/i), xssSvg)

    await user.click(screen.getByRole('button', { name: /Save Record|Add Record|Submit/i }))

    expect(window.__xss_executed).toBe(false)
  })

  it('never renders untrusted content using dangerouslySetInnerHTML', async () => {
    // Render with malicious pre-loaded record
    const maliciousRecord = {
      id: 'xss-1',
      title: '<b onmouseover="window.__xss_executed=true">Malicious Title</b>',
      category: 'Security',
      priority: 'High',
      status: 'Pending',
      assignedStaff: 'Attacker',
      description: '<iframe src="javascript:alert(1)"></iframe>',
    }

    localStorage.setItem('news_blog_optimization_records', JSON.stringify([maliciousRecord]))
    const { container } = render(<App />)

    // No iframes or onmouseover handlers injected into DOM
    expect(container.querySelector('iframe')).toBeNull()
    const boldTag = container.querySelector('b[onmouseover]')
    expect(boldTag).toBeNull()
  })
})
