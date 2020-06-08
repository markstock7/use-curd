import React, { createContext } from 'react'
import { Status } from './interface'
interface ResourceContextProps {
  afterCreatedHandler: (status: Status, ns: string) => void
  afterUpdatedHandler: (status: Status, ns: string) => void
  afterDeletedHandler: (status: Status, ns: string) => void
}

const noop = (_: Status) => {}

const defaultContextValue = {
  afterCreatedHandler: noop,
  afterUpdatedHandler: noop,
  afterDeletedHandler: noop
}

const ResourceContext = createContext<ResourceContextProps>(defaultContextValue)

export const ResourceProvider: React.FC<ResourceContextProps> = ({
  children,
  ...contextValue
}) => {
  return (
    <ResourceContext.Provider
      value={{ ...contextValue, ...defaultContextValue }}
    >
      {children}
    </ResourceContext.Provider>
  )
}

export default ResourceContext
