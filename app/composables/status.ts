import { useStore } from '~/composables/store'
import type { Status, Section } from '~~/types'

export function useStatusManagement() {
  const store = useStore()

  const addStatus = (status: Status) => {
    store.statuses.push(status)
  }

  const updateStatus = (index: number, status: Status) => {
    store.statuses[index] = status
  }

  const removeStatus = (index: number) => {
    store.statuses.splice(index, 1)
  }

  const updateSectionStatus = (key: string, status: string) => {
    const section = store.findSectionByKey(key)
    if (section) {
      section.status = status
      updateParentStatuses()
    }
  }

  const updateParentStatuses = () => {
    const getStatusIndex = (status: string) => store.statuses.findIndex(s => s.name === status)

    const updateStatusRecursively = (node: Section) => {
      if (!node.children || !node.children.length) {
        return
      }

      node.children.forEach(updateStatusRecursively)
      const statuses = node.children.map(child => child.status)
      const uniqueStatuses = [...new Set(statuses)]

      if (uniqueStatuses.length === 1) {
        node.status = uniqueStatuses[0]
        return
      }

      const leastAdvancedStatus = uniqueStatuses.reduce((prev, curr) => {
        return getStatusIndex(curr || '') < getStatusIndex(prev || '') ? curr : prev || ''
      }, uniqueStatuses[0] || '')
      node.status = leastAdvancedStatus
    }

    store.sections.forEach(updateStatusRecursively)
  }

  return {
    addStatus,
    updateStatus,
    removeStatus,
    updateSectionStatus,
    updateParentStatuses,
  }
}
