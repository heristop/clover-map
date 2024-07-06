import type { Project, Section } from '~~/types'

export function useProjects() {
  const store = useStore()

  const projects = computed(() => store.projects)
  const currentProject = computed(() => store.currentProject)
  const projectNames = computed(() => store.projectNames)

  function addProject(name: string, sections: Section[] = []) {
    const newProject: Project = {
      id: Date.now().toString(),
      name,
      sections: [],
    }

    store.addProject(newProject, sections)
  }

  function setCurrentProject(projectId: string | undefined) {
    store.setCurrentProjectId(projectId as string)
    const project = store.projects.find(p => p.id === projectId)
    if (project) {
      store.setSections(project.sections)
    }
  }

  function updateCurrentProject(sections: Section[]) {
    store.updateCurrentProjectSections(sections)
  }

  function renameProject(projectId: string, newName: string) {
    const project = store.projects.find(p => p.id === projectId)
    if (project) {
      project.name = newName
    }
  }

  function deleteProject(projectId: string) {
    const index = store.projects.findIndex(p => p.id === projectId)
    if (index !== -1) {
      store.projects.splice(index, 1)
      if (store.currentProjectId === projectId) {
        setCurrentProject(store.projects[0]?.id)
      }
    }
  }

  function importProject(projectData: Project) {
    store.addProject(projectData)
  }

  function exportProject(projectId: string): Project | null {
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
