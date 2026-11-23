import { useState } from 'react'
import { validateOptimizationForm } from '../utils/validation'

const CATEGORY_OPTIONS = [
  'Asset Optimization',
  'Assets',
  'Caching',
  'Code Splitting',
  'CSS',
  'Database',
  'Image Optimization',
  'Images',
  'Layout',
  'Media',
  'Networking',
  'Server / CDN',
  'Third-Party Scripts',
  'Typography',
  'Other',
]

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low']
const STATUS_OPTIONS = ['Pending', 'In Progress', 'Completed']

export default function OptimizationForm({ initialData, onSubmit, onCancel }) {
  const isEditing = Boolean(initialData && initialData.id)

  const [formData, setFormData] = useState(() => ({
    title: initialData?.title || '',
    category: initialData?.category || '',
    priority: initialData?.priority || 'Medium',
    status: initialData?.status || 'Pending',
    assignedStaff: initialData?.assignedStaff || '',
    description: initialData?.description || '',
  }))

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear specific field error as user types valid content
    if (errors[field]) {
      const nextData = { ...formData, [field]: value }
      const validation = validateOptimizationForm(nextData)
      if (!validation.errors[field]) {
        setErrors((prev) => {
          const next = { ...prev }
          delete next[field]
          return next
        })
      } else {
        setErrors((prev) => ({ ...prev, [field]: validation.errors[field] }))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const validation = validateOptimizationForm(formData)
    if (!validation.isValid) {
      setErrors(validation.errors)
      return
    }

    onSubmit(formData)
  }

  return (
    <section
      id="optimization-form-section"
      className="form-section"
      aria-label={isEditing ? 'Edit Optimization Record' : 'Add New Optimization Record'}
    >
      <div className="form-card">
        <div className="form-header">
          <h2 className="form-title">
            {isEditing ? `Edit Record: ${initialData.title}` : 'Create Optimization Initiative'}
          </h2>
          <p className="form-subtitle">
            Provide technical specifications, categorization, and personnel assignment.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="optimization-form">
          <div className="form-row">
            {/* Title field */}
            <div className="form-field form-field-full">
              <label htmlFor="form-title" className="form-label">
                Title <span className="required-star" aria-hidden="true">*</span>
              </label>
              <input
                id="form-title"
                name="title"
                type="text"
                className={`form-input ${errors.title ? 'input-invalid' : ''}`}
                style={errors.title ? { borderColor: '#dc2626' } : undefined}
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                aria-invalid={errors.title ? 'true' : 'false'}
                aria-describedby={errors.title ? 'error-title' : undefined}
                aria-required="true"
                placeholder="e.g. Convert Hero Images to AVIF/WebP"
              />
              {errors.title && (
                <div id="error-title" role="alert" className="form-error">
                  {errors.title}
                </div>
              )}
            </div>
          </div>

          <div className="form-row form-row-cols-3">
            {/* Category field */}
            <div className="form-field">
              <label htmlFor="form-category" className="form-label">
                Category <span className="required-star" aria-hidden="true">*</span>
              </label>
              <select
                id="form-category"
                name="category"
                className={`form-select ${errors.category ? 'input-invalid' : ''}`}
                style={errors.category ? { borderColor: '#dc2626' } : undefined}
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                aria-invalid={errors.category ? 'true' : 'false'}
                aria-describedby={errors.category ? 'error-category' : undefined}
                aria-required="true"
              >
                <option value="">Select Category...</option>
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
              {errors.category && (
                <div id="error-category" role="alert" className="form-error">
                  {errors.category}
                </div>
              )}
            </div>

            {/* Priority field */}
            <div className="form-field">
              <label htmlFor="form-priority" className="form-label">
                Priority <span className="required-star" aria-hidden="true">*</span>
              </label>
              <select
                id="form-priority"
                name="priority"
                className={`form-select ${errors.priority ? 'input-invalid' : ''}`}
                style={errors.priority ? { borderColor: '#dc2626' } : undefined}
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                aria-invalid={errors.priority ? 'true' : 'false'}
                aria-describedby={errors.priority ? 'error-priority' : undefined}
                aria-required="true"
              >
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
              {errors.priority && (
                <div id="error-priority" role="alert" className="form-error">
                  {errors.priority}
                </div>
              )}
            </div>

            {/* Status field */}
            <div className="form-field">
              <label htmlFor="form-status" className="form-label">
                Status
              </label>
              <select
                id="form-status"
                name="status"
                className={`form-select ${errors.status ? 'input-invalid' : ''}`}
                style={errors.status ? { borderColor: '#dc2626' } : undefined}
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                aria-invalid={errors.status ? 'true' : 'false'}
                aria-describedby={errors.status ? 'error-status' : undefined}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {errors.status && (
                <div id="error-status" role="alert" className="form-error">
                  {errors.status}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Assigned Staff field */}
            <div className="form-field form-field-full">
              <label htmlFor="form-assignedStaff" className="form-label">
                Assigned Staff <span className="required-star" aria-hidden="true">*</span>
              </label>
              <input
                id="form-assignedStaff"
                name="assignedStaff"
                type="text"
                className={`form-input ${errors.assignedStaff ? 'input-invalid' : ''}`}
                style={errors.assignedStaff ? { borderColor: '#dc2626' } : undefined}
                value={formData.assignedStaff}
                onChange={(e) => handleChange('assignedStaff', e.target.value)}
                aria-invalid={errors.assignedStaff ? 'true' : 'false'}
                aria-describedby={errors.assignedStaff ? 'error-staff' : undefined}
                aria-required="true"
                placeholder="e.g. Elena Rostova"
              />
              {errors.assignedStaff && (
                <div id="error-staff" role="alert" className="form-error">
                  {errors.assignedStaff}
                </div>
              )}
            </div>
          </div>

          <div className="form-row">
            {/* Description field */}
            <div className="form-field form-field-full">
              <label htmlFor="form-description" className="form-label">
                Description <span className="required-star" aria-hidden="true">*</span>
              </label>
              <textarea
                id="form-description"
                name="description"
                rows="4"
                className={`form-textarea ${errors.description ? 'input-invalid' : ''}`}
                style={errors.description ? { borderColor: '#dc2626' } : undefined}
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                aria-invalid={errors.description ? 'true' : 'false'}
                aria-describedby={errors.description ? 'error-description' : undefined}
                aria-required="true"
                placeholder="Detail technical requirements, expected performance gains, and implementation approach..."
              />
              {errors.description && (
                <div id="error-description" role="alert" className="form-error">
                  {errors.description}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
            >
              {isEditing ? 'Save Changes' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}
