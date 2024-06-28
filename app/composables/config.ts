import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '~/composables/store'
import validate from '~/validator'
import type { Section } from '~~/types'
import { useSnackbar } from '#imports'

export function useConfig() {
  const router = useRouter()
  const store = useStore()
  const snackbar = useSnackbar()
  const fileInput = ref<HTMLInputElement | null>(null)

  const validateSections = (sections: Section[]): boolean => {
    if (validate(sections)) {
      return true
    }

    displayInvalidDataError()

    return false
  }

  const loadFromModel = async (model: string) => {
    await store.fetchSections(model)
    router.push('/viewport')
  }

  const loadFromFile = async (event: Event): Promise<boolean | undefined> => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const sections = JSON.parse(e.target?.result as string) as Section[]

          if (!validateSections(sections)) {
            return false
          }

          store.setSections(sections)
          router.push('/viewport')

          return true
        }
        catch (error) {
          displayInvalidDataError()

          return false
        }
      }

      reader.readAsText(file)
    }

    return undefined
  }

  const saveToFile = () => {
    const sections = JSON.stringify(store.sections, null, 2)
    const blob = new Blob([sections], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `tree-pulse-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadFromUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url)
      const sections = await response.json()

      if (!validateSections(sections)) {
        displayInvalidDataError()

        return false
      }

      store.setSections(sections)
      router.push('/viewport')

      return true
    }
    catch (error) {
      snackbar.add({
        type: 'error',
        title: 'Error fetching data. Please check the URL and try again.',
      })
    }

    return false
  }

  const loadFromUserInput = async (sample: string): Promise<boolean> => {
    let data

    try {
      data = JSON.parse(sample)
    }
    catch (error) {
      displayInvalidDataError()

      return false
    }

    if (validateSections(data)) {
      store.setSections(data)
      router.push('/viewport')

      return true
    }

    return false
  }

  const displayInvalidDataError = () => {
    snackbar.add({
      type: 'error',
      title: 'Invalid data format. Please check the structure of your JSON.',
    })
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
