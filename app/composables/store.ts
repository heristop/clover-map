import { defineStore } from 'pinia'
import type { Project, Section, Status } from '~~/types'

const defaultStatus = [
  { name: 'To Do', color: '#FFB3BA' },
  { name: 'In Progress', color: '#FFDFBA' },
  { name: 'Done', color: '#FFFFBA' },
  { name: 'Closed', color: '#BAFFC9' },
]

export const pastelColors = [
  '#FFB3BA', // Light Pink
  '#FFDFBA', // Light Orange
  '#FFFFBA', // Light Yellow
  '#BAFFC9', // Light Green
  '#BAE1FF', // Light Blue
  '#E2CFCF', // Light Red
  '#C9C9FF', // Light Purple
  '#D4A5A5', // Light Rose
  '#FFD1DC', // Light Pinkish
  '#B2B2B2', // Light Gray
]

type State = {
  projects: Project[]
  currentProjectId: string | null
  sections: Section[]
  parentMap: { [key: string]: string | null }
  panelCollapsed: boolean
  drawerMinimized: boolean
  minWidth: number
  minHeight: number
  displayLabel: string
  statuses: Status[]
  viewMode: string
  darkMode: boolean
  isEditingMode: boolean
}

export const useStore = defineStore('store', {
  state: (): State => ({
    projects: [],
    currentProjectId: null,
    sections: [] as Section[],
    parentMap: {} as { [key: string]: string | null },
    panelCollapsed: false,
    drawerMinimized: false,
    minWidth: 80,
    minHeight: 10,
    displayLabel: 'name',
    statuses: defaultStatus,
    viewMode: 'flex',
    darkMode: false,
    isEditingMode: false,
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  actions: {
    addProject(project: Project, sections: Section[] = []) {
      this.projects.push(project)
      this.currentProjectId = project.id

      if (sections.length) {
        this.setSections(sections)
      }
    },

    setStatuses(statuses: Status[] | Record<number, Status>) {
      if (Array.isArray(statuses)) {
        this.statuses = statuses
      }
      else {
        this.statuses = Object.values(statuses).filter(status => typeof status === 'object' && status !== null)
      }
    },

    setCurrentProjectId(projectId: string) {
      this.currentProjectId = projectId
    },

    updateCurrentProjectSections(sections: Section[]) {
      const currentProject = this.projects.find(p => p.id === this.currentProjectId)

      if (currentProject) {
        currentProject.sections = sections
      }
    },

    setSections(sections: Section[]) {
      const sectionArray = JSON.parse(JSON.stringify(sections))
      const extractedStatuses = this.extractStatuses(sectionArray)

      if (extractedStatuses.length > 0) {
        this.statuses = extractedStatuses
      }

      const formattedSections = this.formatSections(sectionArray)
      this.sections = this.applyDefaultStatus(formattedSections)
      this.updateCurrentProjectSections(this.sections)
      this.updateParentStatuses()
    },

    extractStatuses(sections: Section[]): Status[] {
      const statusSet = new Set<string>()
      const statusColors: { [key: string]: string } = {}
      let colorIndex = 0

      const traverse = (nodes: Section[]) => {
        nodes.forEach((node) => {
          if (node.status) {
            statusSet.add(node.status)

            if (!statusColors[node.status]) {
              statusColors[node.status] = pastelColors[colorIndex % pastelColors.length] as string
              colorIndex++
            }
          }

          if (node.children) {
            traverse(node.children)
          }
        })
      }
      traverse(sections)

      return Array.from(statusSet).map(status => ({
        name: status,
        color: statusColors[status] || '',
      }))
    },

    applyDefaultStatus(sections: Section[]): Section[] {
      const findSectionByKey = (key: string): Section | undefined => {
        const findRecursively = (nodes: Section[]): Section | undefined => {
          for (const node of nodes) {
            if (node.key === key) {
              return node
            }

            if (node.children) {
              const found = findRecursively(node.children)

              if (found) {
                return found
              }
            }
          }
        }

        return findRecursively(this.sections)
      }

      return sections.map((node) => {
        const existingProject = findSectionByKey(node.key)

        if (!node.status) {
          if (existingProject) {
            node.status = existingProject.status
          }

          if (!existingProject) {
            node.status = this.statuses[0]?.name || ''
          }
        }

        if (node.children) {
          node.children = this.applyDefaultStatus(node.children)
        }

        return node
      })
    },

    updateParentStatuses() {
      const getStatusIndex = (status: string) => this.statuses.findIndex(s => s.name === status)

      const updateStatusRecursively = (node: Section) => {
        if (!node.children || !node.children.length) {
          return
        }

        node.children.forEach(updateStatusRecursively)
        const statuses = node.children.map(child => child.status)
        const uniqueStatuses = [...new Set(statuses)]

        if (uniqueStatuses.length === 1) {
          node.status = uniqueStatuses[0]

          return
        }

        const leastAdvancedStatus = uniqueStatuses.reduce((prev, curr) => {
          return getStatusIndex(curr || '') < getStatusIndex(prev || '') ? curr : prev || ''
        }, uniqueStatuses[0] || '')
        node.status = leastAdvancedStatus
      }

      this.sections.forEach(updateStatusRecursively)
    },

    updateSectionStatus(key: string, status: string) {
      const findAndUpdateStatus = (nodes: Section[]): boolean => {
        for (const node of nodes) {
          if (node.key === key) {
            node.status = status
            return true
          }

          if (node.children && findAndUpdateStatus(node.children)) {
            return true
          }
        }
        return false
      }

      if (findAndUpdateStatus(this.sections)) {
        this.updateParentStatuses()
        this.updateCurrentProjectSections(this.sections)
      }
    },

    async fetchSectionsFromUrl(url: string): Promise<Section[] | null> {
      return await $fetch<Section[]>(url, { method: 'get' }).catch(() => {
        return null
      })
    },

    async fetchSections(model: string): Promise<Section[]> {
      const sections = await this.getSections(model)
      this.setSections(sections)
      this.initializeParentMap(this.sections)

      return sections
    },

    async getSections(model: string): Promise<Section[]> {
      return $fetch(`/api/config?model=${model}`, { method: 'get' })
    },

    formatSections(sections: Section[]): Section[] {
      return sections.map((section: Section) => {
        const { name, key, children, status, isCollapsed } = section
        const formattedChildren = children ? this.formatSections(children) : []

        return {
          key,
          name,
          children: formattedChildren,
          status: status || '',
          isCollapsed: isCollapsed || false,
        }
      })
    },

    updateSectionCollapse(key: string) {
      const section = this.findSectionByKey(key)

      if (section) {
        section.isCollapsed = !section.isCollapsed
      }
    },

    initializeParentMap(sections: Section[]) {
      const buildParentMap = (sections: Section[], parentKey: string | null = null) => {
        sections.forEach((section) => {
          if (parentKey) {
            this.parentMap[section.key] = parentKey
          }

          if (section.children) {
            buildParentMap(section.children, section.key)
          }
        })
      }

      this.parentMap = {}
      buildParentMap(sections)
    },

    findSectionByKey(key: string): Section | null | undefined {
      const findRecursively = (sections: Section[]): Section | null | undefined => {
        for (const section of sections) {
          if (section.key === key) {
            return section
          }

          if (section.children) {
            const found = findRecursively(section.children)

            if (found) {
              return found
            }
          }
        }
        return null
      }
      return findRecursively(this.sections)
    },

    swapSections(key1: string, key2: string) {
      const parentKey1 = this.parentMap[key1]
      const parentKey2 = this.parentMap[key2]

      if (parentKey1 && parentKey2) {
        const parentSection1 = this.findSectionByKey(parentKey1)
        const parentSection2 = this.findSectionByKey(parentKey2)

        if (parentSection1 && parentSection2) {
          const index1 = parentSection1.children?.findIndex(child => child.key === key1) ?? -1
          const index2 = parentSection2.children?.findIndex(child => child.key === key2) ?? -1

          if (index1 !== -1 && index2 !== -1) {
            const child1 = parentSection1.children?.[index1]
            const child2 = parentSection2.children?.[index2]

            if (child1 && child2) {
              [parentSection1.children![index1], parentSection2.children![index2]] = [child2, child1]
            }
          }
        }
      }
      else {
        const index1 = this.sections.findIndex(section => section.key === key1)
        const index2 = this.sections.findIndex(section => section.key === key2)

        if (index1 !== -1 && index2 !== -1) {
          const section1 = this.sections[index1]
          const section2 = this.sections[index2]

          if (section1 && section2) {
            [this.sections[index1], this.sections[index2]] = [section2, section1]
          }
        }
      }
    },

    hasParent(key: string): boolean {
      return key in this.parentMap
    },

    toggleCollapse() {
      this.panelCollapsed = !this.panelCollapsed
    },

    toggleMinimize() {
      this.drawerMinimized = !this.drawerMinimized
    },

    toggleEditingMode() {
      this.isEditingMode = !this.isEditingMode
    },

    clear() {
      this.sections = []
      this.currentProjectId = null
      this.statuses = defaultStatus
    },
  },
  getters: {
    currentProject(): Project | undefined {
      return this.projects.find(p => p.id === this.currentProjectId)
    },

    projectNames(): string[] {
      return this.projects.map(project => project.name)
    },

    duplicateSections(state): { sections: string[], keys: string[] } {
      const sections: string[] = []
      const keys: string[] = []

      const checkDuplicates = (nodes: Section[]) => {
        nodes.forEach((node) => {
          sections.push(node.name)
          keys.push(node.key ?? '')

          if (node.children) {
            checkDuplicates(node.children)
          }
        })
      }

      checkDuplicates(state.sections)

      return {
        sections: sections.filter((item, index) => sections.indexOf(item) !== index),
        keys: keys.filter((item, index) => keys.indexOf(item) !== index),
      }
    },
  },
})
