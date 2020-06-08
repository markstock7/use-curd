import { useState, useCallback, useRef, useMemo } from 'react'
import { ResourceService, Status } from './interface'
import useStatus from './useStatus'
import useSWR, { mutate as mutateByNS } from 'swr'
import NotFound from './errors/NotFound'

export interface ExportedResourceAPI<T extends {}> {
  handleUpdate: () => void
  handleChange: (
    data: ((prevValue: T) => Partial<T>) | Partial<T> | undefined
  ) => void
}

type Response<T> = [
  T,
  {
    isModified: boolean
    fetchStatus: { error: any }
    updateStatus: Status
    handleChange: (
      data: ((prevValue: T) => Partial<T>) | Partial<T> | undefined
    ) => void
    handleUpdate: () => any
  }
]

function createResource<T extends { id?: string }>(
  resourceService: Pick<
    ResourceService<T>,
    'fetchById' | 'update' | 'namespace'
  >
) {
  return (resourceId: string): Response<T> => {
    const [isModified, toggleModified] = useState(false)
    const updateStatus = useStatus(false)

    const { data, error, mutate } = useSWR(
      `${resourceService.namespace}-single`,
      () => resourceService.fetchById(resourceId),
      {
        suspense: true
      }
    )

    const resourceRef = useRef<T | undefined>(data)

    if (data === null) {
      // should we change the data?
      resourceRef.current = data
      throw new NotFound(`${resourceService.namespace} Not Found.`)
    }

    const handleUpdate = useCallback(() => {
      updateStatus.listen(
        mutateByNS(
          resourceService.namespace,
          async (resources: T[]) => {
            const newData = await mutate(async () => {
              return await resourceService.update(resourceRef.current as T)
            })

            if (newData) {
              const payloadIndex = resources.findIndex(
                _ => _.id === (newData.id as string)
              )
              return resources.splice(payloadIndex, 1).concat([]) as T[]
            }
            return resources
          },
          false
        )
      )
    }, [])

    const handleChange = useCallback(
      // eslint-disable-next-line no-shadow
      (data: ((prevValue: T) => Partial<T>) | Partial<T>) => {
        const payload =
          typeof data === 'function' ? data(resourceRef.current as T) : data
        const newV: T = { ...resourceRef.current, ...(payload || {}) } as T
        resourceRef.current = newV
        toggleModified(true)
      },
      []
    )

    return useMemo(() => {
      return [
        resourceRef.current as T,
        {
          isModified,
          handleUpdate,
          handleChange,
          fetchStatus: { error },
          updateStatus: updateStatus.status
        }
      ]
    }, [data])
  }
}

export default createResource
