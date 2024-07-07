import type { Project, Section } from '~~/types'
import { useStore } from '~/composables/store'

export function useProjects() {
  const store = useStore()

  const projects = computed((): Project[] => store.projects)
  const currentProject = computed(() => store.currentProject)
  const projectNames = computed(() => store.projectNames)

  const addProject = (name: string, sections: Section[] = []) => {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      sections: [],
      createdAt: new Date(),
    }

    store.addProject(newProject, sections)
  }

  const setCurrentProject = (projectId: string) => {
    const project = store.projects.find(p => p.id === projectId)

    if (project) {
      store.setCurrentProjectId(projectId)
      store.setSections(project.sections)
    }
  }

  const updateCurrentProject = (sections: Section[]) => {
    store.updateCurrentProjectSections(sections)
  }

  const renameProject = (projectId: string, newName: string) => {
    const project = store.projects.find(p => p.id === projectId)

    if (project) {
      project.name = newName
    }
  }

  const deleteProject = (projectId: string) => {
    const index = store.projects.findIndex(p => p.id === projectId)

    if (index !== -1) {
      store.projects.splice(index, 1)

      if (store.currentProjectId === projectId && store.projects[0]) {
        setCurrentProject(store.projects[0].id)
      }
    }
  }

  const importProject = (projectData: Project) => {
    store.addProject(projectData)
  }

  const exportProject = (projectId: string): Project | null => {
    return store.projects.find(p => p.id === projectId) || null
  }

  return {
    projects,
    currentProject,
    projectNames,
    addProject,
    setCurrentProject,
    updateCurrentProject,
    renameProject,
    deleteProject,
    importProject,
    exportProject,
  }
}
