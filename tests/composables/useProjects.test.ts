import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useProjects } from '~/composables/project'
import type { Project, Section } from '~~/types'

const mockStore = {
  projects: [] as Project[],
  currentProjectId: null as string | null,
  currentProject: null as Project | null,
  projectNames: [] as string[],
  addProject: vi.fn(),
  setCurrentProjectId: vi.fn(),
  setSections: vi.fn(),
  updateCurrentProjectSections: vi.fn(),
}

vi.mock('~/composables/store', () => ({
  useStore: () => mockStore,
}))

describe('useProjects', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockStore.projects = []
    mockStore.currentProjectId = null
    mockStore.currentProject = null
    mockStore.projectNames = []
  })

  it('should add a project', () => {
    const { addProject } = useProjects()
    const name = 'New Project'
    const sections: Section[] = []

    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-01-01'))

    addProject(name, sections)

    expect(mockStore.addProject).toHaveBeenCalledWith(
      expect.objectContaining({
        id: expect.any(String),
        name,
        sections: [],
        createdAt: new Date('2025-01-01'),
      }),
      sections,
    )

    vi.useRealTimers()
  })

  it('should set current project', () => {
    const { setCurrentProject } = useProjects()
    const projectId = '1'
    const project: Project = { id: projectId, name: 'Project 1', sections: [], createdAt: new Date() }
    mockStore.projects = [project]

    setCurrentProject(projectId)

    expect(mockStore.setCurrentProjectId).toHaveBeenCalledWith(projectId)
    expect(mockStore.setSections).toHaveBeenCalledWith(project.sections)
  })

  it('should update current project', () => {
    const { updateCurrentProject } = useProjects()
    const sections: Section[] = [{ key: '1', name: 'Section 1' }]

    updateCurrentProject(sections)

    expect(mockStore.updateCurrentProjectSections).toHaveBeenCalledWith(sections)
  })

  it('should rename a project', () => {
    const { renameProject } = useProjects()
    const projectId = '1'
    const newName = 'Renamed Project'
    const project: Project = { id: projectId, name: 'Project 1', sections: [], createdAt: new Date() }
    mockStore.projects = [project]

    renameProject(projectId, newName)

    expect(project.name).toBe(newName)
  })

  it('should delete the last project', () => {
    const { deleteProject } = useProjects()
    const projectId = '1'
    const project: Project = { id: projectId, name: 'Project 1', sections: [], createdAt: new Date() }
    mockStore.projects = [project]
    mockStore.currentProjectId = projectId

    deleteProject(projectId)

    expect(mockStore.projects).toHaveLength(0)
    expect(mockStore.setCurrentProjectId).not.toHaveBeenCalled()
  })

  it('should import a project', () => {
    const { importProject } = useProjects()
    const projectData: Project = { id: '1', name: 'Imported Project', sections: [], createdAt: new Date() }

    importProject(projectData)

    expect(mockStore.addProject).toHaveBeenCalledWith(projectData)
  })

  it('should export a project', () => {
    const { exportProject } = useProjects()
    const projectId = '1'
    const project: Project = { id: projectId, name: 'Project 1', sections: [], createdAt: new Date() }
    mockStore.projects = [project]

    const exportedProject = exportProject(projectId)

    expect(exportedProject).toEqual(project)
  })
})
