import { useState, useCallback, useRef, useEffect } from 'react'
import { Status } from './interface'

function useStatus(init: boolean) {
  const [status, updateState] = useState<Status>({
    processing: init,
    error: null,
    data: null
  })
  const listen = useCallback(async function listen<T>(
    promiseV: Promise<T>
  ): Promise<T> {
    updateState({
      processing: true,
      error: null
    })
    try {
      const data = await promiseV
      updateState({
        processing: false,
        error: null,
        data
      })
      return data
    } catch (error) {
      updateState({
        processing: false,
        error: error
      })
      return error
    }
  },
  [])

  return { status, listen }
}

export const useDone = (
  status: Status,
  callback: (status: Status, ns?: string) => void,
  ns?: string
) => {
  const prevStatusRef = useRef(status)
  useEffect(() => {
    const isToggled =
      prevStatusRef.current.processing === true && !status.processing
    prevStatusRef.current = status
    if (isToggled) callback(status, ns)
  }, [status])
}

export default useStatus
