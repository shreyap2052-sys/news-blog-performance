/**
 * LocalStorage persistence utility with error handling and fallback support
 */

export const STORAGE_KEY = 'news_blog_optimization_records'

/**
 * Loads optimization records from localStorage
 * @returns {Array} Array of stored records, or empty array if none found or error occurs
 */
export function loadStoredRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return []
    }
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch (err) {
    console.error('Failed to parse records from localStorage:', err)
    return []
  }
}

/**
 * Persists optimization records to localStorage
 * @param {Array} records - Array of records to save
 * @returns {{ success: boolean, error?: string }}
 */
export function persistRecords(records) {
  try {
    const serialized = JSON.stringify(records)
    localStorage.setItem(STORAGE_KEY, serialized)
    return { success: true }
  } catch (err) {
    console.error('Failed to save records to localStorage:', err)
    const isQuota =
      err &&
      (err.name === 'QuotaExceededError' ||
        err.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
        err.code === 22 ||
        err.code === 1014)

    const errorMessage = isQuota
      ? 'Storage quota exceeded. Unable to save records to local storage.'
      : 'Storage failed. Unable to persist records to local storage.'

    return {
      success: false,
      error: errorMessage,
    }
  }
}
