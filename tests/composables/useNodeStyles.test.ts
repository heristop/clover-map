import { setActivePinia, createPinia } from 'pinia'
import { describe, it, expect, beforeEach } from 'vitest'
import { useNodeStyles } from '~/composables/style'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

describe('useNodeStyles', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should return correct styles for a node', () => {
    const store = useStore()
    store.minWidth = 80
    store.minHeight = 10
    store.statuses = [
      { name: 'To Do', color: '#FFB3BA' },
      { name: 'In Progress', color: '#FFDFBA' },
    ]
    store.duplicateSections.keys = []

    const { getNodeStyles } = useNodeStyles()
    const node: Section = { key: '1', name: 'Section 1', status: 'To Do', children: [] }
    const styles = getNodeStyles(node, 1)

    expect(styles).toEqual({
      backgroundColor: '#F0A4AB', // #FFB3BA darkened by 6%
      borderColor: '#F0A4AB',
      minWidth: '80px',
      minHeight: '10px',
      margin: '4px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      boxSizing: 'border-box',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s',
      borderStyle: 'solid',
    })
  })

  it('should darken color correctly', () => {
    const { darkenColor } = useNodeStyles()
    const color = '#FFB3BA'
    const darkenedColor = darkenColor(color, 6)

    expect(darkenedColor).toBe('#F0A4AB') // #FFB3BA darkened by 6%
  })

  it('should return dashed border for duplicate keys', () => {
    const store = useStore()
    store.minWidth = 80
    store.minHeight = 10
    store.statuses = [
      { name: 'To Do', color: '#FFB3BA' },
      { name: 'In Progress', color: '#FFDFBA' },
    ]
    store.duplicateSections.keys = ['1']

    const { getNodeStyles } = useNodeStyles()
    const node: Section = { key: '1', name: 'Section 1', status: 'To Do', children: [] }
    const styles = getNodeStyles(node, 1)

    expect(styles.borderStyle).toBe('dashed')
    expect(styles.borderColor).toBe('#FF7B7B')
  })
})
