import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

export function useNodeOperations() {
  const store = useStore()

  const addSection = (parentKey: string, newSection: Section) => {
    const parent = store.findSectionByKey(parentKey)

    if (parent) {
      parent.children = parent.children || []
      parent.children.push(newSection)
      store.parentMap[newSection.key] = parentKey
    }
  }

  const addSiblingSection = (parentKey: string, siblingKey: string, newSibling: Section) => {
    const parent = store.findSectionByKey(parentKey)
    if (parent && parent.children) {
      const index = parent.children.findIndex(child => child.key === siblingKey)

      if (index !== -1) {
        parent.children.splice(index + 1, 0, newSibling)
        store.parentMap[newSibling.key] = parentKey
      }
    }
  }

  const addRootSection = (newSection: Section) => {
    store.sections.push(newSection)
    store.parentMap[newSection.key] = null
  }

  return {
    addSection,
    addSiblingSection,
    addRootSection,
  }
}
