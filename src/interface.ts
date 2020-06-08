export interface AnyAction {
  type: string
  payload: any
}

export interface ResourceService<T> {
  namespace: string
  fetchById: (id: string) => Promise<T>
  create: (resource: T) => Promise<T>
  update: (resource: T) => Promise<T>
  fetchAll: () => Promise<T[]>
  delete: (id: string) => Promise<any>
}

export interface Status {
  processing: boolean
  error: any
  data?: any
}
