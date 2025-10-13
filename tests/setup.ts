import { vi } from 'vitest'

// Vue auto-imports
import * as Vue from 'vue'

// Mock localStorage for pinia-plugin-persistedstate
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
    key: vi.fn(),
    length: 0,
  },
  writable: true,
})

// Mock Nuxt auto-imports
vi.stubGlobal('defineNuxtPlugin', vi.fn())
vi.stubGlobal('navigateTo', vi.fn())
vi.stubGlobal('useRuntimeConfig', vi.fn(() => ({})))
vi.stubGlobal('useNuxtApp', vi.fn(() => ({})))
vi.stubGlobal('useRoute', vi.fn())
vi.stubGlobal('useRouter', vi.fn())
vi.stubGlobal('$fetch', vi.fn())
Object.entries(Vue).forEach(([key, value]) => {
  if (typeof value === 'function') {
    vi.stubGlobal(key, value)
  }
})
