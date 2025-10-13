import type { Section } from '~~/types'

export function validate(data: unknown): data is Section[] {
  if (!Array.isArray(data)) {
    return false
  }

  return data.every(validateSection)
}

function validateSection(section: unknown): section is Section {
  if (typeof section !== 'object' || section === null) {
    return false
  }

  const s = section as Record<string, unknown>

  // Required fields
  if (typeof s.name !== 'string' || !s.name) {
    return false
  }

  if (typeof s.key !== 'string' || !s.key) {
    return false
  }

  // Optional fields
  if (s.status !== undefined && typeof s.status !== 'string') {
    return false
  }

  if (s.isCollapsed !== undefined && typeof s.isCollapsed !== 'boolean') {
    return false
  }

  // Recursive validation for children
  if (s.children !== undefined) {
    if (!Array.isArray(s.children)) {
      return false
    }
    return s.children.every(validateSection)
  }

  return true
}
