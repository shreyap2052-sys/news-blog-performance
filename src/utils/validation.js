/**
 * Form validation utilities for Performance Optimization Records
 */

/**
 * Validates optimization record fields
 * @param {Object} data - Form data
 * @returns {{ isValid: boolean, errors: Object }}
 */
export function validateOptimizationForm(data) {
  const errors = {}

  // Title validation
  const title = (data.title || '').trim()
  if (!title) {
    errors.title = 'Title is required'
  } else if (title.length < 3) {
    errors.title = 'Title must be at least 3 characters'
  } else if (title.length > 120) {
    errors.title = 'Title must not exceed 120 characters'
  }

  // Category validation
  const category = (data.category || '').trim()
  if (!category) {
    errors.category = 'Category is required'
  }

  // Priority validation
  const priority = (data.priority || '').trim()
  if (!priority) {
    errors.priority = 'Priority is required'
  } else if (!['Low', 'Medium', 'High'].includes(priority)) {
    errors.priority = 'Priority must be High, Medium, or Low'
  }

  // Assigned Staff validation
  const staff = (data.assignedStaff || '').trim()
  if (!staff) {
    errors.assignedStaff = 'Assigned Staff is required'
  } else if (!/[a-zA-Z]/.test(staff)) {
    errors.assignedStaff = 'Invalid staff name: Staff name must contain letters'
  } else if (staff.length < 2) {
    errors.assignedStaff = 'Assigned staff name must be at least 2 characters'
  }

  // Description validation
  const description = (data.description || '').trim()
  if (!description) {
    errors.description = 'Description is required'
  } else if (description.length < 5) {
    errors.description = 'Description must be at least 5 characters'
  }

  // Status validation (optional, defaults to Pending)
  const status = (data.status || 'Pending').trim()
  if (status && !['Pending', 'In Progress', 'Completed'].includes(status)) {
    errors.status = 'Status must be Pending, In Progress, or Completed'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
