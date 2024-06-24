import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/composables/store'
import type { Section } from '~~/types'

export function useUpload() {
  const router = useRouter()
  const store = useStore()
  const fileInput = ref<HTMLInputElement | null>(null)

  const loadSectionsFromFile = async (event: Event) => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const sections = JSON.parse(e.target?.result as string) as Section[]
          if (!Array.isArray(sections)) {
            throw new Error('Invalid sections format, expected an array')
          }

          store.setSections(sections)
          router.push('/panel')
        }
        catch (error) {
          console.error('Error parsing JSON:', error)
        }
      }

      reader.readAsText(file)
      router.push('/panel')
    }
  }

  const saveSectionsToFile = () => {
    const sections = JSON.stringify(store.sections, null, 2)
    const blob = new Blob([sections], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `trackerMap-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  return {
    fileInput,
    loadSectionsFromFile,
    saveSectionsToFile,
  }
}
