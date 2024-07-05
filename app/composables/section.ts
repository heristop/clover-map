import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

export function useSectionManagement() {
  const store = useStore()

  const updateSectionKey = (key: string, newKey: string) => {
    const section = findSectionByKey(key)
    if (section) {
      section.key = newKey
    }
  }

  const updateSectionName = (key: string, newName: string) => {
    const section = findSectionByKey(key)
    if (section) {
      section.name = newName
    }
  }

  const deleteSection = (key: string) => {
    const deleteRecursively = (sections: Section[], key: string): boolean => {
      const index = sections.findIndex(section => section.key === key)
      if (index !== -1) {
        sections.splice(index, 1)
        Reflect.deleteProperty(store.parentMap, key)
        return true
      }
      return sections.some(section => section.children && deleteRecursively(section.children, key))
    }
    deleteRecursively(store.sections, key)
  }

  const findSectionByKey = (key: string): Section | null | undefined => {
    const findRecursively = (sections: Section[]): Section | null | undefined => {
      for (const section of sections) {
        if (section.key === key) {
          return section
        }
        if (section.children) {
          const found = findRecursively(section.children)
          if (found) {
            return found
          }
        }
      }
      return null
    }
    return findRecursively(store.sections)
  }

  return {
    updateSectionKey,
    updateSectionName,
    deleteSection,
    findSectionByKey,
  }
}
