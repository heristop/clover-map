import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Section, Status } from '~~/types'

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
  '#FF6961', // Pastel Red
  '#F49AC2', // Pastel Pink
  '#77DD77', // Pastel Green
  '#AEC6CF', // Pastel Blue
  '#CFCFC4', // Pastel Gray
  '#B19CD9', // Pastel Lilac
]

export const useStore = defineStore('store', {
  state: () => ({
    sections: [] as Section[],
    configLoaded: false,
    dialogMinimized: false,
    minWidth: 80,
    minHeight: 10,
    displayLabel: 'name',
    statuses: ref<Status[]>(defaultStatus),
    viewMode: 'flex',
    darkMode: false,
    isEditingMode: false,
  }),
  persist: {
    storage: persistedState.localStorage,
  },
  actions: {
    async fetchSectionsFromUrl(url: string): Promise<Section[] | null> {
      return await $fetch<Section[]>(url, { method: 'get' }).catch(() => {
        return null
      })
    },
    async fetchSections(model: string): Promise<void> {
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

      const formattedSections = this.formatSections(sectionArray)

      this.sections = this.applyDefaultStatus(formattedSections, this.sections)
      this.updateParentStatuses()
      this.configLoaded = true
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
    applyDefaultStatus(sections: Section[], existingProjects: Section[]): Section[] {
      return sections.map((node) => {
        const existingProject = this.findProjectByKey(node.key, existingProjects)

        if (!node.status) {
          if (existingProject) {
            node.status = existingProject.status
          }

          if (!existingProject) {
            node.status = this.statuses[0]?.name || ''
          }
        }

        if (node.children) {
          node.children = this.applyDefaultStatus(node.children, existingProject?.children ?? [])
        }

        return node
      })
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
    updateSectionStatus(key: string, status: string) {
      const section = this.findProjectByKey(key, this.sections)

      if (section) {
        section.status = status
        this.updateParentStatuses()
      }
    },
    updateSectionCollapse(key: string) {
      const section = this.findProjectByKey(key, this.sections)

      if (section) {
        section.isCollapsed = !section.isCollapsed
      }
    },
    addSection(parentKey: string, newSection: Section) {
      const parent = this.findProjectByKey(parentKey, this.sections)
      if (parent) {
        if (!parent.children) {
          parent.children = []
        }
        parent.children.push(newSection)
      }
    },
    addSiblingSection(parentKey: string, newSection: Section) {
      const parent = this.findParentByKey(parentKey, this.sections)

      if (parent) {
        parent.children.push(newSection)

        return
      }

      this.sections.push(newSection)
    },
    deleteSection(key: string) {
      const deleteRecursively = (sections: Section[], key: string): Section[] => {
        return sections
          .filter(section => section.key !== key)
          .map(section => ({
            ...section,
            children: section.children ? deleteRecursively(section.children, key) : [],
          }))
      }

      this.sections = deleteRecursively(this.sections, key)
    },
    findProjectByKey(key: string, sections: Section[]): Section | undefined {
      for (const node of sections) {
        if (node.key === key) {
          return node
        }

        if (node.children) {
          const found = this.findProjectByKey(key, node.children)

          if (found) {
            return found
          }
        }
      }

      return undefined
    },
    findParentByKey(key: string, sections: Section[]): Section | undefined {
      for (const node of sections) {
        if (node.children) {
          for (const child of node.children) {
            if (child.key === key) {
              return node
            }
          }
          const parent = this.findParentByKey(key, node.children)

          if (parent) {
            return parent
          }
        }
      }

      return undefined
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
    updateSectionLabel(key: string, newLabel: string) {
      const section = this.findProjectByKey(key, this.sections)
      if (section) {
        if (this.displayLabel === 'key') {
          section.key = newLabel

          return
        }

        section.name = newLabel
      }
    },
    toggleEditingMode() {
      this.isEditingMode = !this.isEditingMode
    },
    clear() {
      this.sections = []
      this.statuses = defaultStatus
      this.configLoaded = false
    },
  },
})
