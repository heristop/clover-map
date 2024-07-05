import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useNodeOperations } from '~/composables/node'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

describe('useNodeOperations', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should add a section', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1', children: [] }] as Section[]
    const { addSection } = useNodeOperations()

    const newSection = { key: '1.1', name: 'New Section', status: '', children: [] }
    addSection('1', newSection)

    expect(store.sections[0]?.children ?? []).toContainEqual(newSection)
  })

  it('should add a sibling section', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1', children: [{ key: '1.1', name: 'Section 1.1' }] }] as Section[]
    const { addSiblingSection } = useNodeOperations()

    const newSibling = { key: '1.2', name: 'New Sibling Section', status: '', children: [] }
    addSiblingSection('1', '1.1', newSibling)

    expect(store.sections[0]?.children).toContainEqual(newSibling)
  })

  it('should add a root section', () => {
    const store = useStore()
    store.sections = [] as Section[]
    const { addRootSection } = useNodeOperations()

    const newRootSection = { key: '1', name: 'New Root Section', status: '', children: [] }
    addRootSection(newRootSection)

    expect(store.sections).toContainEqual(newRootSection)
  })
})
