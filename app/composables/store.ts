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
    parentMap: {} as Record<string, string>,
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
      this.initializeParentMap(this.sections)
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
        const existingProject = this.findSectionByKey(node.key, existingProjects)

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
      const section = this.findSectionByKey(key, this.sections)

      if (section) {
        section.status = status
        this.updateParentStatuses()
      }
    },
    updateSectionCollapse(key: string) {
      const section = this.findSectionByKey(key, this.sections)

      if (section) {
        section.isCollapsed = !section.isCollapsed
      }
    },
    updateSectionKey(key: string, newKey: string) {
      const section = this.findSectionByKey(key, this.sections)
      if (section) {
        section.key = newKey
      }
    },
    updateSectionName(key: string, newName: string) {
      const section = this.findSectionByKey(key, this.sections)
      if (section) {
        section.name = newName
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
    addSection(parentKey: string, newSection: Section) {
      const parent = this.findSectionByKey(parentKey, this.sections)
      if (parent) {
        parent.children = parent.children || []
        parent.children.push(newSection)
        this.parentMap[newSection.key] = parentKey
      }
    },
    addSiblingSection(key: string, newSection: Section) {
      const parentKey = this.parentMap[key]
      if (parentKey) {
        this.addSection(parentKey, newSection)
      }
      else {
        this.sections.push(newSection)
      }
    },
    deleteSection(key: string) {
      const deleteRecursively = (sections: Section[], key: string): boolean => {
        const index = sections.findIndex(section => section.key === key)
        if (index !== -1) {
          sections.splice(index, 1)
          Reflect.deleteProperty(this.parentMap, key)
          return true
        }
        return sections.some(section => section.children && deleteRecursively(section.children, key))
      }
      deleteRecursively(this.sections, key)
    },
    swapSections(key1: string, key2: string) {
      const parentKey1 = this.parentMap[key1]
      const parentKey2 = this.parentMap[key2]

      if (parentKey1 && parentKey2) {
        const parentSection1 = this.findSectionByKey(parentKey1, this.sections)
        const parentSection2 = this.findSectionByKey(parentKey2, this.sections)

        if (parentSection1 && parentSection2) {
          const index1 = parentSection1.children!.findIndex(child => child.key === key1)
          const index2 = parentSection2.children!.findIndex(child => child.key === key2)

          if (index1 !== -1 && index2 !== -1) {
            [parentSection1.children![index1], parentSection2.children![index2]] = [parentSection2.children![index2], parentSection1.children![index1]]
          }
        }
      }
      else {
        const index1 = this.sections.findIndex(section => section.key === key1)
        const index2 = this.sections.findIndex(section => section.key === key2)

        if (index1 !== -1 && index2 !== -1) {
          [this.sections[index1], this.sections[index2]] = [this.sections[index2], this.sections[index1]]
        }
      }
    },
    findSectionByKey(key: string, sections: Section[]): Section | undefined {
      for (const section of sections) {
        if (section.key === key) {
          return section
        }
        if (section.children) {
          const found = this.findSectionByKey(key, section.children)
          if (found) {
            return found
          }
        }
      }
      return undefined
    },
    hasParent(key: string): boolean {
      return key in this.parentMap
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
    toggleEditingMode() {
      this.isEditingMode = !this.isEditingMode
    },
    clear() {
      this.sections = []
      this.statuses = defaultStatus
      this.configLoaded = false
    },
  },
  getters: {
    duplicateProjects(state): { sections: string[], keys: string[] } {
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
