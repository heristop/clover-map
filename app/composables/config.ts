import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

export function useConfig() {
  const router = useRouter()
  const store = useStore()
  const fileInput = ref<HTMLInputElement | null>(null)

  const loadFromModel = async (model: string) => {
    await store.fetchSections(model)
    router.push('/viewport')
  }

  const loadFromFile = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const sections = JSON.parse(e.target?.result as string) as Section[]
          store.setSections(sections)
          nextTick(() => router.push('/viewport'))
        }
        catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }

      reader.readAsText(file)
    }
  }

  const saveToFile = () => {
    const sections = JSON.stringify(store.sections, null, 2)
    const blob = new Blob([sections], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `trackerMap-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadFromUrl = async (url: string) => {
    await store.fetchSectionsFromUrl(url)
    router.push('/viewport')
  }

  const loadFromUserInput = async (sample: Section[]) => {
    store.setSections(sample)
    router.push('/viewport')
  }

  return {
    fileInput,
    loadFromModel,
    loadFromFile,
    saveToFile,
    loadFromUrl,
    loadFromUserInput,
  }
}
