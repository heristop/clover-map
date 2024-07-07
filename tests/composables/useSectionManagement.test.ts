import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useSectionManagement } from '~/composables/section'
import type { Section } from '~~/types'

const mockStore = {
  sections: [] as Section[],
  parentMap: {} as Record<string, string>,
  findSectionByKey: vi.fn(),
}

vi.mock('~/composables/store', () => ({
  useStore: () => mockStore,
}))

describe('useSectionManagement', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockStore.sections = []
    mockStore.parentMap = {}
  })

  it('should update section key', () => {
    const mockSection = { key: '1', name: 'Section 1' } as Section | undefined
    mockStore.findSectionByKey.mockReturnValue(mockSection)

    const { updateSectionKey } = useSectionManagement()

    updateSectionKey('1', '2')

    expect(mockStore.findSectionByKey).toHaveBeenCalledWith('1')
    expect(mockSection!.key).toBe('2')
  })

  it('should update section name', () => {
    const mockSection = { key: '1', name: 'Section 1' } as Section
    mockStore.findSectionByKey.mockReturnValue(mockSection)

    const { updateSectionName } = useSectionManagement()

    updateSectionName('1', 'Updated Section')

    expect(mockStore.findSectionByKey).toHaveBeenCalledWith('1')
    expect(mockSection.name).toBe('Updated Section')
  })

  it('should delete a section', () => {
    mockStore.sections = [
      { key: '1', name: 'Section 1' },
      { key: '2', name: 'Section 2', children: [{ key: '2.1', name: 'Subsection 2.1' }] },
    ] as Section[]
    mockStore.parentMap = { 2.1: '2' }

    const { deleteSection } = useSectionManagement()

    deleteSection('2.1')

    expect(mockStore.sections[1]?.children).toEqual([])
    expect(mockStore.parentMap).not.toHaveProperty('2.1')
  })

  it('should delete a root section', () => {
    mockStore.sections = [
      { key: '1', name: 'Section 1' },
      { key: '2', name: 'Section 2' },
    ] as Section[]

    const { deleteSection } = useSectionManagement()

    deleteSection('1')

    expect(mockStore.sections).toEqual([{ key: '2', name: 'Section 2' }])
  })
})
