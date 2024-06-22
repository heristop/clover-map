export interface Section {
  name: string
  path: string
  status?: string
  children?: Section[]
}

export interface Status {
  name: string
  color: string
}
