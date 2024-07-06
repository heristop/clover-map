export interface Project {
  id: string
  name: string
  sections: Section[]
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
