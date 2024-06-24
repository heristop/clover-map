export interface Section {
  name: string
  key: string
  status?: string
  children?: Section[]
}

export interface Status {
  name: string
  color: string
}
