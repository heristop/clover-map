import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useSectionManagement } from '~/composables/section'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

describe('useSectionManagement', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should update section key', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1' }] as Section[]
    const { updateSectionKey, findSectionByKey } = useSectionManagement()

    updateSectionKey('1', '2')
    const section = findSectionByKey('2')

    expect(section).toBeDefined()
    expect(section?.key).toBe('2')
  })

  it('should update section name', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1' }] as Section[]
    const { updateSectionName, findSectionByKey } = useSectionManagement()

    updateSectionName('1', 'Updated Section')
    const section = findSectionByKey('1')

    expect(section).toBeDefined()
    expect(section?.name).toBe('Updated Section')
  })

  it('should delete a section', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1' }] as Section[]
    const { deleteSection, findSectionByKey } = useSectionManagement()

    deleteSection('1')
    const section = findSectionByKey('1')

    expect(section).toBeNull()
  })

  it('should find section by key', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1' }] as Section[]
    const { findSectionByKey } = useSectionManagement()

    const section = findSectionByKey('1')

    expect(section).toBeDefined()
    expect(section?.key).toBe('1')
  })
})
