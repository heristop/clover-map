import type { LocationQueryValue } from 'vue-router'
import { validate } from '~/validator'
import type { Project, Section, Status } from '~~/types'

export function useConfig() {
  const router = useRouter()
  const store = useStore()
  const { addProject } = useProjects()
  const snackbar = useSnackbar()
  const fileInput = ref<HTMLInputElement | null>(null)

  const createProject = (name: string, sections: Section[], statuses?: Status[]) => {
    addProject(name, sections)

    if (statuses) {
      store.setStatuses(statuses)
    }
  }

  const loadProjectConfig = (id: string | LocationQueryValue[]) => {
    const projects = store.projects

    if (projects.length === 0) {
      return
    }

    const project = projects.find(p => p.id === id)

    if (project) {
      createProject(project.name, project.sections)
      router.push(`/projects/${project.id}`)

      return
    }

    snackbar.add({
      type: 'error',
      title: 'Project not found in local storage.',
    })
  }

  const loadFromModel = async (model: string) => {
    try {
      const sections = await store.fetchSections(model) as Section[]

      if (!validate(sections)) {
        throw new Error('Invalid data format')
      }

      createProject(model, sections)
      router.push(`/projects/${store.currentProject?.id}`)
    }
    catch (error) {
      snackbar.add({
        type: 'error',
        title: 'Error loading data from model.',
      })
    }
  }

  const loadFromFile = async (event: Event): Promise<boolean | undefined> => {
    const file = (event.target as HTMLInputElement).files?.[0]

    if (file) {
      const reader = new FileReader()

      reader.onload = async (e) => {
        try {
          const project = JSON.parse(e.target?.result as string) as Project
          const sections = project.sections
          const statuses = project.statuses

          if (!validate(sections)) {
            throw new Error('Invalid data format')
          }

          createProject(file.name.replace('.json', ''), sections, statuses)
          router.push(`/projects/${store.currentProject?.id}`)

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

  const exportToFile = () => {
    const currentProject = store.currentProject
    if (!currentProject) {
      snackbar.add({
        type: 'error',
        title: 'No project selected for export.',
      })

      return
    }

    const statuses = store.statuses;
    const sections = JSON.stringify({ ...currentProject, statuses: { ...statuses } }, null, 2)
    const blob = new Blob([sections], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${currentProject.name}-${new Date().toISOString()}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const loadFromUrl = async (url: string): Promise<boolean> => {
    try {
      const response = await fetch(url)
      const sections = await response.json()

      if (!validate(sections)) {
        displayInvalidDataError()

        return false
      }

      createProject(new URL(url).pathname.split('/').pop() || 'URL Project', sections)
      router.push(`/projects/${store.currentProject?.id}`)

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

    if (validate(data)) {
      createProject('User Input Project', data)
      router.push(`/projects/${store.currentProject?.id}`)

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
    loadProjectConfig,
    loadFromModel,
    loadFromFile,
    exportToFile,
    loadFromUrl,
    loadFromUserInput,
  }
}
