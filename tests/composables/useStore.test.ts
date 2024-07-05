import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

const defaultStatus = [
  { name: 'To Do', color: '#FFB3BA' },
  { name: 'In Progress', color: '#FFDFBA' },
  { name: 'Done', color: '#FFFFBA' },
  { name: 'Closed', color: '#BAFFC9' },
]

describe('useStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useStore()
    expect(store.sections).toEqual([])
    expect(store.parentMap).toEqual({})
    expect(store.configLoaded).toBe(false)
    expect(store.dialogMinimized).toBe(false)
    expect(store.minWidth).toBe(80)
    expect(store.minHeight).toBe(10)
    expect(store.displayLabel).toBe('name')
    expect(store.statuses).toEqual(defaultStatus)
    expect(store.viewMode).toBe('flex')
    expect(store.darkMode).toBe(false)
    expect(store.isEditingMode).toBe(false)
  })

  it('should fetch sections from URL', async () => {
    const store = useStore()
    const sections = [{ key: '1', name: 'Section 1' }] as Section[]
    vi.spyOn(global, '$fetch').mockResolvedValue(sections)

    const result = await store.fetchSectionsFromUrl('/fake-url')
    expect(result).toEqual(sections)
  })

  it('should fetch sections by model', async () => {
    const store = useStore()
    const sections = [{ key: '1', name: 'Section 1' }] as Section[]
    vi.spyOn(store, 'getSections').mockResolvedValue(sections)
    vi.spyOn(store, 'setSections')

    await store.fetchSections('model1')

    expect(store.getSections).toHaveBeenCalledWith('model1')
    expect(store.setSections).toHaveBeenCalledWith(sections)
    expect(store.configLoaded).toBe(true)
  })

  it('should update section collapse state', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1', isCollapsed: false }] as Section[]

    store.updateSectionCollapse('1')
    expect(store.sections[0]?.isCollapsed).toBe(true)

    store.updateSectionCollapse('1')
    expect(store.sections[0]?.isCollapsed).toBe(false)
  })

  it('should initialize parent map', () => {
    const store = useStore()
    const sections = [
      { key: '1', name: 'Section 1', children: [{ key: '1.1', name: 'Section 1.1' }] },
    ] as Section[]

    store.initializeParentMap(sections)
    expect(store.parentMap).toEqual({ 1.1: '1' })
  })

  it('should find section by key', () => {
    const store = useStore()
    const sections = [
      { key: '1', name: 'Section 1', children: [{ key: '1.1', name: 'Section 1.1' }] },
    ] as Section[]

    store.sections = sections

    const section = store.findSectionByKey('1.1')
    expect(section).toEqual({ key: '1.1', name: 'Section 1.1' })
  })

  it('should swap sections', () => {
    const store = useStore()
    store.sections = [
      { key: '1', name: 'Section 1' },
      { key: '2', name: 'Section 2' },
    ] as Section[]

    store.swapSections('1', '2')
    expect(store.sections[0]?.key).toBe('2')
    expect(store.sections[1]?.key).toBe('1')
  })

  it('should clear store state', () => {
    const store = useStore()
    store.sections = [{ key: '1', name: 'Section 1' }] as Section[]
    store.configLoaded = true

    store.clear()
    expect(store.sections).toEqual([])
    expect(store.statuses).toEqual(defaultStatus)
    expect(store.configLoaded).toBe(false)
  })

  it('should toggle dialog minimized state', () => {
    const store = useStore()
    store.dialogMinimized = false

    store.toggleMinimize()
    expect(store.dialogMinimized).toBe(true)

    store.toggleMinimize()
    expect(store.dialogMinimized).toBe(false)
  })

  it('should toggle editing mode state', () => {
    const store = useStore()
    store.isEditingMode = false

    store.toggleEditingMode()
    expect(store.isEditingMode).toBe(true)

    store.toggleEditingMode()
    expect(store.isEditingMode).toBe(false)
  })

  it('should identify duplicate projects', () => {
    const store = useStore()
    const sections = [
      { key: '1', name: 'Section 1', children: [{ key: '1.1', name: 'Section 1.1' }] },
      { key: '2', name: 'Section 1', children: [{ key: '2.1', name: 'Section 2.1' }] },
    ] as Section[]

    store.sections = sections

    const duplicates = store.duplicateProjects
    expect(duplicates.sections).toEqual(['Section 1'])
    expect(duplicates.keys).toEqual([])
  })
})
