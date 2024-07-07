export interface Project {
  id: string
  name: string
  sections: Section[]
  createdAt: Date
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
