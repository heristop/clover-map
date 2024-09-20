import { computed } from 'vue'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

export function useNodeStyles() {
  const store = useStore()
  const duplicateKeys = computed(() => store.duplicateSections.keys)

  const getNodeStyles = (node: Section, depth: number) => {
    const statusObj = Array.isArray(store.statuses)
      ? store.statuses.find((s: { name: string | undefined }) => s.name === node.status)
      : null
    let backgroundColor = statusObj ? statusObj.color : '#D44D8'
    backgroundColor = darkenColor(backgroundColor, depth * 6)

    const isDuplicate = duplicateKeys.value.includes(node.key)

    return {
      backgroundColor: backgroundColor,
      borderColor: isDuplicate ? '#FF7B7B' : backgroundColor,
      minWidth: `${store.minWidth}px`,
      minHeight: `${store.minHeight}px`,
      margin: '4px',
      padding: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '8px',
      boxSizing: 'border-box',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'transform 0.2s, box-shadow 0.2s, background-color 0.3s',
      borderStyle: isDuplicate ? 'dashed' : 'solid',
    }
  }

  const darkenColor = (color: string, percent: number) => {
    if (!/^#[0-9A-F]{6}$/i.test(color)) {
      return color
    }

    const num = parseInt(color.replace('#', ''), 16),
      amt = Math.round(2.55 * percent),
      R = Math.max((num >> 16) - amt, 0),
      G = Math.max((num >> 8 & 0x00FF) - amt, 0),
      B = Math.max((num & 0x0000FF) - amt, 0)

    return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1).toUpperCase()
  }

  return {
    getNodeStyles,
    darkenColor,
  }
}
