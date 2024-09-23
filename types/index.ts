export interface Project {
  id: string
  name: string
  sections: Section[]
  createdAt: Date
  statuses?: Status[]
}

export interface Section {
  name: string
  key: string
  status?: string
  children?: Section[]
  isCollapsed?: boolean
}

export interface Status {
  name: string
  color: string
}

export type SectionWithOptionalStatus = Omit<Section, 'status'> & { status?: string }
