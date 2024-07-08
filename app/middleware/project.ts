import { useStore } from '~/composables/store'
import { useProjects } from '~/composables/project'

const store = useStore()
const { setCurrentProject } = useProjects()

export default defineNuxtRouteMiddleware(() => {
  if (store.projects.length >= 1 && store.currentProjectId) {
    const projectId = store.projects[store.projects.length - 1]?.id

    if (projectId) {
      setCurrentProject(projectId)

      return navigateTo(`/projects/${projectId}`)
    }
  }
})
