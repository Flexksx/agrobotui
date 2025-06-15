"use client"

import { useState } from "react"
import { usePolling } from "./use-polling"

interface UseAutoRefreshOptions {
  interval?: number
  enabled?: boolean
  onError?: (error: Error) => void
}

export function useAutoRefresh<T>(fetchFunction: () => Promise<T>, options: UseAutoRefreshOptions = {}) {
  const { interval = 5000, enabled = true, onError } = options
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)

  const refresh = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchFunction()
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Unknown error")
      setError(error)
      onError?.(error)
    } finally {
      setLoading(false)
    }
  }

  const { start, stop, restart } = usePolling(refresh, {
    interval,
    immediate: true,
    enabled,
  })

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh,
    start,
    stop,
    restart,
  }
}
