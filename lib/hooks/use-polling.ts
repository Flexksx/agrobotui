"use client"

import { useEffect, useRef, useCallback } from "react"

interface UsePollingOptions {
  interval?: number
  immediate?: boolean
  enabled?: boolean
}

export function usePolling(callback: () => Promise<void> | void, options: UsePollingOptions = {}) {
  const { interval = 5000, immediate = true, enabled = true } = options
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const callbackRef = useRef(callback)

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const start = useCallback(() => {
    if (intervalRef.current) return

    if (immediate) {
      callbackRef.current()
    }

    intervalRef.current = setInterval(() => {
      callbackRef.current()
    }, interval)
  }, [interval, immediate])

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const restart = useCallback(() => {
    stop()
    start()
  }, [stop, start])

  useEffect(() => {
    if (enabled) {
      start()
    } else {
      stop()
    }

    return stop
  }, [enabled, start, stop])

  return { start, stop, restart }
}
