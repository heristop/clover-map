import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Section, Status } from '~~/types'

const defaultStatus = [
  { name: 'To Do', color: '#AEC6CF' }, // Pastel blue
  { name: 'In Progress', color: '#FFDAB9' }, // Pastel peach
  { name: 'Done', color: '#C1E1C1' }, // Pastel green
]

export const useStore = defineStore('store', {
  state: () => ({
    sections: [] as Section[],
    configLoaded: false,
    dialogMinimized: true,
    dialogCoordinates: { x: 0, y: 0 },
    minWidth: 80,
    minHeight: 10,
    display: 'section',
    statuses: ref<Status[]>(defaultStatus),
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  actions: {
    async fetchSections(model: string) {
      const sections = await this.getSections(model)
      this.setSections(sections)
    },
    async getSections(model: string): Promise<Section[]> {
      return $fetch(`/api/config?model=${model}`, { method: 'get' })
    },
    setSections(sections: Section[]) {
      const sectionArray = Object.values(sections)
      const extractedStatuses = this.extractStatuses(sectionArray)

      if (extractedStatuses.length > 0) {
        this.statuses = extractedStatuses
      }

      const formattedModules = this.formatModules(sectionArray)

      this.sections = this.applyDefaultStatus(formattedModules, this.sections)
      this.updateParentStatuses()
      this.configLoaded = true
    },
    formatModules(sections: Section[]): Section[] {
      return sections.map((section: Section) => {
        const { name, children, status, path } = section
        const formattedChildren = children ? this.formatModules(children) : []
        return {
          path: path,
          name,
          children: formattedChildren,
          status: status || '',
        }
      })
    },
    applyDefaultStatus(sections: Section[], existingProjects: Section[]): Section[] {
      return sections.map((module) => {
        const existingProject = this.findProjectByPath(module.path, existingProjects)
        if (!module.status && existingProject) {
          module.status = existingProject.status
        }
        else if (!module.status) {
          module.status = this.statuses[0]?.name || ''
        }
        if (module.children) {
          module.children = this.applyDefaultStatus(module.children, existingProject?.children ?? [])
        }
        return module
      })
    },
    extractStatuses(sections: Section[]): Status[] {
      const statusSet = new Set<string>()
      const statusColors: { [key: string]: string } = {}
      const pastelColors = [
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
        '#FF6961', // Pastel Red
        '#F49AC2', // Pastel Pink
        '#77DD77', // Pastel Green
        '#AEC6CF', // Pastel Blue
        '#CFCFC4', // Pastel Gray
        '#B19CD9', // Pastel Lilac
      ]
      let colorIndex = 0

      const traverse = (modules: Section[]) => {
        modules.forEach((module) => {
          if (module.status) {
            statusSet.add(module.status)
            if (!statusColors[module.status]) {
              statusColors[module.status] = pastelColors[colorIndex % pastelColors.length] as string
              colorIndex++
            }
          }
          if (module.children) {
            traverse(module.children)
          }
        })
      }
      traverse(sections)

      return Array.from(statusSet).map(status => ({
        name: status,
        color: statusColors[status] || '',
      }))
    },
    updateSectionStatus(path: string, status: string) {
      const module = this.findProjectByPath(path, this.sections)
      if (module) {
        module.status = status
        this.updateParentStatuses()
      }
    },
    findProjectByPath(path: string, sections: Section[]): Section | undefined {
      for (const module of sections) {
        if (module.path === path) return module
        if (module.children) {
          const found = this.findProjectByPath(path, module.children)
          if (found) return found
        }
      }
      return undefined
    },
    updateParentStatuses() {
      const getStatusIndex = (status: string) => this.statuses.findIndex(s => s.name === status)

      const updateStatusRecursively = (module: Section) => {
        if (module.children && module.children.length) {
          module.children.forEach(updateStatusRecursively)
          const statuses = module.children.map(child => child.status)
          const uniqueStatuses = [...new Set(statuses)]
          if (uniqueStatuses.length === 1) {
            module.status = uniqueStatuses[0]
          }
          else {
            const leastAdvancedStatus = uniqueStatuses.reduce((prev, curr) => {
              return getStatusIndex(curr || '') < getStatusIndex(prev || '') ? curr : prev || ''
            }, uniqueStatuses[0] || '')
            module.status = leastAdvancedStatus
          }
        }
      }
      this.sections.forEach(updateStatusRecursively)
    },
    toggleMinimize() {
      this.dialogMinimized = !this.dialogMinimized
    },
    addStatus(status: Status) {
      this.statuses.push(status)
    },
    updateStatus(index: number, status: Status) {
      this.statuses[index] = status
    },
    removeStatus(index: number) {
      this.statuses.splice(index, 1)
    },
    updateDialogCoordinates(x: number, y: number) {
      this.dialogCoordinates = { x, y }
    },
    clear() {
      this.sections = []
      this.statuses = defaultStatus
      this.configLoaded = false
    },
  },
  getters: {
    duplicateProjects(state): { sections: string[], paths: string[] } {
      const sections: string[] = []
      const paths: string[] = []

      const checkDuplicates = (modules: Section[]) => {
        modules.forEach((module) => {
          sections.push(module.name)
          paths.push(module.path ?? '')
          if (module.children) {
            checkDuplicates(module.children)
          }
        })
      }

      checkDuplicates(state.sections)

      return {
        sections: sections.filter((item, index) => sections.indexOf(item) !== index),
        paths: paths.filter((item, index) => paths.indexOf(item) !== index),
      }
    },
  },
})
