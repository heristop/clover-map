import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

export function useSectionManagement() {
  const store = useStore()

  const updateSectionKey = (key: string, newKey: string) => {
    const section = store.findSectionByKey(key)

    if (section) {
      section.key = newKey
    }
  }

  const updateSectionName = (key: string, newName: string) => {
    const section = store.findSectionByKey(key)

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

  return {
    updateSectionKey,
    updateSectionName,
    deleteSection,
  }
}
