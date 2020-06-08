import { useCallback, useContext, useMemo } from 'react'
import { ResourceService, Status } from './interface'
import useStatus, { useDone } from './useStatus'
import useSWR, { mutate as mutateByNS } from 'swr'
import ResourceContext from './ResourceContext'

type Response<T> = [
  T[],
  {
    loadingStatus: { error: any }
    createStatus: Status
    updateStatus: Status
    deleteStatus: Status
    handleCreate: (payload: T) => any
    handleUpdate: (payload: T) => any
    handleDelete: (id: string) => any
  }
]

function useResources<T extends { id?: string }>(
  resourceService: Omit<ResourceService<T>, 'fetchById'>
): Response<T> {
  const createStatus = useStatus(false)
  const updateStatus = useStatus(false)
  const deleteStatus = useStatus(false)

  const { data, error, mutate } = useSWR(
    resourceService.namespace,
    resourceService.fetchAll,
    {
      suspense: true,
      initialData: [],
      errorRetryInterval: 1000
    }
  )

  const context = useContext(ResourceContext)

  const handleCreate = useCallback(async (payload: T) => {
    mutate(async resources => {
      const newData = await createStatus.listen(resourceService.create(payload))
      return [newData, ...resources] as T[]
    }, false)
  }, [])

  const handleUpdate = useCallback((payload: T) => {
    updateStatus.listen(
      mutate(async resources => {
        const newData = await resourceService.update(payload)
        const payloadIndex = resources.findIndex(
          _ => _.id === (newData.id as string)
        )
        return resources.splice(payloadIndex, 1).concat([]) as T[]
      }, false)
    )
  }, [])

  const handleDelete = useCallback((id: string) => {
    deleteStatus.listen(
      mutate(async (resources: T[]) => {
        await mutateByNS(
          `${resourceService.namespace}-single`,
          resourceService.delete(id).then(_ => null)
        )
        return resources.filter(_ => _.id !== id)
      }, false)
    )
  }, [])

  useDone(
    createStatus.status,
    context.afterCreatedHandler,
    resourceService.namespace
  )
  useDone(
    updateStatus.status,
    context.afterCreatedHandler,
    resourceService.namespace
  )
  useDone(
    deleteStatus.status,
    context.afterCreatedHandler,
    resourceService.namespace
  )

  return useMemo(() => {
    return [
      data as T[],
      {
        loadingStatus: { error },
        createStatus: createStatus.status,
        updateStatus: updateStatus.status,
        deleteStatus: deleteStatus.status,
        handleCreate,
        handleUpdate,
        handleDelete
      }
    ]
  }, [data])
}

export default useResources
