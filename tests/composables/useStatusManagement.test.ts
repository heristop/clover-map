import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useStatusManagement } from '~/composables/status'
import { useStore } from '~/composables/store'
import type { Section, Status } from '~~/types'

describe('useStatusManagement', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add a status', () => {
    const store = useStore()
    const { addStatus } = useStatusManagement()

    const newStatus = { name: 'New Status', color: '#FFFFFF' }
    addStatus(newStatus)

    expect(store.statuses).toContainEqual(newStatus)
  })

  it('should update a status', () => {
    const store = useStore()
    store.statuses = [{ name: 'Old Status', color: '#FFFFFF' }] as Status[]
    const { updateStatus } = useStatusManagement()

    const updatedStatus = { name: 'Updated Status', color: '#000000' }
    updateStatus(0, updatedStatus)

    expect(store.statuses[0]).toEqual(updatedStatus)
  })

  it('should remove a status', () => {
    const store = useStore()
    store.statuses = [{ name: 'Status to be removed', color: '#FFFFFF' }] as Status[]
    const { removeStatus } = useStatusManagement()

    removeStatus(0)

    expect(store.statuses).not.toContain({ name: 'Status to be removed', color: '#FFFFFF' })
  })

  it('should update section status', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1', status: 'Old Status' }] as Section[]
    const { updateSectionStatus } = useStatusManagement()

    updateSectionStatus('1', 'New Status')
    const section = store.sections.find(s => s.key === '1')

    expect(section?.status).toBe('New Status')
  })

  it('should update parent statuses', () => {
    const store = useStore()
    store.sections = [
      {
        key: '1',
        name: 'Parent Section',
        status: '',
        children: [
          { key: '1.1', name: 'Child Section 1', status: 'Status 1' },
          { key: '1.2', name: 'Child Section 2', status: 'Status 2' },
        ],
      },
    ] as Section[]
    const { updateParentStatuses } = useStatusManagement()

    updateParentStatuses()
    const parentSection = store.sections.find(s => s.key === '1')

    expect(parentSection?.status).toBe('Status 1')
  })
})
