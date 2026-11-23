/**
 * Security and sanitization utilities
 * Protects against Cross-Site Scripting (XSS) attacks before storing user inputs in state.
 */

/**
 * Sanitizes a string input by stripping dangerous tags, event handlers, and javascript protocols.
 * @param {string} input - User-provided text
 * @returns {string} Sanitized string safe for React state and DOM rendering
 */
export function sanitizeInput(input) {
  if (typeof input !== 'string') {
    return ''
  }

  let sanitized = input

  // Remove <script> tags and their entire contents
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

  // Remove <iframe>, <object>, <embed>, <applet>, <base>, <link>, <style>, <meta> tags and contents
  sanitized = sanitized.replace(/<(iframe|object|embed|applet|base|link|style|meta)\b[^<]*(?:(?!<\/\1>)<[^<]*)*<\/\1>/gi, '')
  sanitized = sanitized.replace(/<(iframe|object|embed|applet|base|link|style|meta)[^>]*\/?>/gi, '')

  // Remove <svg> tags and their contents if they contain event handlers
  sanitized = sanitized.replace(/<svg\b[^<]*(?:(?!<\/svg>)<[^<]*)*<\/svg>/gi, (match) => {
    // Extract inner text
    return match.replace(/<[^>]+>/g, '')
  })

  // Remove <img> tags completely if they contain event handlers or invalid sources
  sanitized = sanitized.replace(/<img\b[^>]*>/gi, '')

  // Strip all inline event handlers (e.g. onload=, onerror=, onmouseover=, onclick=)
  sanitized = sanitized.replace(/\s*on\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, '')

  // Remove javascript: and data: pseudo-protocols
  sanitized = sanitized.replace(/(javascript|data|vbscript):/gi, '')

  // Remove any remaining angle brackets if they form incomplete/malicious tags
  // but preserve standard text characters
  sanitized = sanitized.replace(/<\/?(script|img|svg|iframe|style|link|body|head)[^>]*>/gi, '')

  return sanitized.trim()
}

/**
 * Sanitizes all text fields of an optimization record
 * @param {Object} record - The optimization record object
 * @returns {Object} Sanitized optimization record
 */
export function sanitizeRecord(record) {
  if (!record || typeof record !== 'object') {
    return record
  }

  return {
    ...record,
    title: sanitizeInput(record.title || ''),
    category: sanitizeInput(record.category || ''),
    priority: sanitizeInput(record.priority || 'Medium'),
    status: sanitizeInput(record.status || 'Pending'),
    assignedStaff: sanitizeInput(record.assignedStaff || ''),
    description: sanitizeInput(record.description || ''),
  }
}
